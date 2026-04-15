from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.permissions import IsAdmin, IsOwnerOrAdmin

from .models import Carrito, CarritoItem, Pedido
from .pagination import PedidosPagination
from .serializers import (
    AgregarItemSerializer,
    CarritoItemSerializer,
    CarritoSerializer,
    CrearPedidoSerializer,
    PedidoSerializer,
)
from .services import (
    PedidoError,
    agregar_item,
    cancelar_pedido,
    crear_pedido_desde_carrito,
    get_or_create_carrito,
)


class CarritoViewSet(viewsets.GenericViewSet):
    serializer_class = CarritoSerializer
    permission_classes = [IsAuthenticated]

    def _carrito(self, request) -> Carrito:
        return get_or_create_carrito(usuario=request.user)

    def list(self, request):
        carrito = (
            Carrito.objects
            .prefetch_related("items__variante__producto")
            .filter(usuario=request.user)
            .first()
        )
        if not carrito:
            carrito = self._carrito(request)
        return Response(self.get_serializer(carrito).data)

    @action(detail=False, methods=["post"], url_path="agregar")
    def agregar(self, request):
        serializer = AgregarItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        carrito = self._carrito(request)
        try:
            item = agregar_item(
                carrito=carrito,
                variante=serializer.validated_data["variante"],
                cantidad=serializer.validated_data["cantidad"],
            )
        except PedidoError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(CarritoItemSerializer(item).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["delete"], url_path=r"items/(?P<item_id>[^/.]+)")
    def remover(self, request, item_id=None):
        carrito = self._carrito(request)
        deleted, _ = CarritoItem.objects.filter(carrito=carrito, pk=item_id).delete()
        if not deleted:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["post"], url_path="vaciar")
    def vaciar(self, request):
        carrito = self._carrito(request)
        carrito.items.all().delete()
        return Response(self.get_serializer(carrito).data)


class PedidoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    pagination_class = PedidosPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["estado", "metodo_pago"]
    ordering_fields = ["created_at", "total"]
    ordering = ["-created_at"]

    def get_queryset(self):
        qs = (
            Pedido.objects
            .select_related("usuario", "direccion")
            .prefetch_related("items__variante__producto")
        )
        if self.request.user.is_staff:
            return qs
        return qs.filter(usuario=self.request.user)

    @action(detail=False, methods=["post"], url_path="crear")
    def crear(self, request):
        serializer = CrearPedidoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            pedido = crear_pedido_desde_carrito(
                usuario=request.user,
                direccion_id=serializer.validated_data["direccion_id"],
                metodo_pago=serializer.validated_data.get("metodo_pago", ""),
                descuento=serializer.validated_data.get("descuento", 0),
                notas=serializer.validated_data.get("notas", ""),
            )
        except PedidoError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(PedidoSerializer(pedido).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="cancelar")
    def cancelar(self, request, pk=None):
        pedido = self.get_object()
        try:
            pedido = cancelar_pedido(
                pedido.pk,
                usuario=request.user,
                motivo=request.data.get("motivo", ""),
            )
        except PedidoError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(PedidoSerializer(pedido).data)

    @action(detail=True, methods=["post"], url_path="cambiar-estado", permission_classes=[IsAdmin])
    def cambiar_estado(self, request, pk=None):
        pedido = self.get_object()
        nuevo = request.data.get("estado")
        if nuevo not in dict(Pedido.Estado.choices):
            return Response(
                {"detail": "Estado inválido."}, status=status.HTTP_400_BAD_REQUEST
            )
        pedido.estado = nuevo
        pedido.save(update_fields=["estado", "updated_at"])
        return Response(PedidoSerializer(pedido).data)
