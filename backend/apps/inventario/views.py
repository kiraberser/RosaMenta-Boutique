from django.db.models import F
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from core.permissions import IsAdmin

from .models import (
    MovimientoStock,
    OrdenCompra,
    Proveedor,
    Stock,
)
from .pagination import InventarioPagination
from .serializers import (
    MovimientoStockSerializer,
    OrdenCompraSerializer,
    ProveedorSerializer,
    StockSerializer,
)
from .services import (
    InventarioError,
    confirmar_recepcion_orden,
    registrar_movimiento,
)


class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.select_related(
        "variante__producto", "variante__producto__categoria"
    )
    serializer_class = StockSerializer
    permission_classes = [IsAdmin]
    pagination_class = InventarioPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["variante__producto", "variante__producto__categoria"]
    search_fields = [
        "variante__sku_variante", "variante__producto__nombre", "variante__producto__sku",
    ]
    ordering_fields = ["cantidad", "updated_at"]

    @action(detail=False, methods=["get"], url_path="bajo")
    def stock_bajo(self, request):
        qs = self.get_queryset().filter(cantidad__lte=F("stock_minimo"))
        page = self.paginate_queryset(qs)
        serializer = self.get_serializer(page or qs, many=True)
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)


class MovimientoStockViewSet(viewsets.ModelViewSet):
    queryset = MovimientoStock.objects.select_related(
        "variante__producto", "usuario"
    )
    serializer_class = MovimientoStockSerializer
    permission_classes = [IsAdmin]
    pagination_class = InventarioPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["tipo", "variante", "variante__producto"]
    ordering_fields = ["fecha"]
    ordering = ["-fecha"]
    http_method_names = ["get", "post", "head", "options"]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            mov = registrar_movimiento(
                variante=serializer.validated_data["variante"],
                tipo=serializer.validated_data["tipo"],
                cantidad=serializer.validated_data["cantidad"],
                motivo=serializer.validated_data.get("motivo", ""),
                referencia=serializer.validated_data.get("referencia", ""),
                usuario=request.user,
            )
        except InventarioError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(self.get_serializer(mov).data, status=status.HTTP_201_CREATED)


class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.prefetch_related("productos")
    serializer_class = ProveedorSerializer
    permission_classes = [IsAdmin]
    pagination_class = InventarioPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["activo"]
    search_fields = ["nombre", "contacto", "email"]


class OrdenCompraViewSet(viewsets.ModelViewSet):
    queryset = (
        OrdenCompra.objects
        .select_related("proveedor", "creada_por")
        .prefetch_related("items__variante__producto")
    )
    serializer_class = OrdenCompraSerializer
    permission_classes = [IsAdmin]
    pagination_class = InventarioPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["estado", "proveedor"]
    ordering_fields = ["fecha_creacion", "fecha_recepcion"]
    ordering = ["-fecha_creacion"]

    @action(detail=True, methods=["post"], url_path="confirmar")
    def confirmar(self, request, pk=None):
        orden = self.get_object()
        if orden.estado != OrdenCompra.Estado.BORRADOR:
            return Response(
                {"detail": "Solo se puede confirmar una OC en borrador."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        orden.estado = OrdenCompra.Estado.CONFIRMADO
        orden.fecha_confirmacion = timezone.now()
        orden.save(update_fields=["estado", "fecha_confirmacion"])
        return Response(self.get_serializer(orden).data)

    @action(detail=True, methods=["post"], url_path="recibir")
    def recibir(self, request, pk=None):
        try:
            orden = confirmar_recepcion_orden(pk, usuario=request.user)
        except InventarioError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(self.get_serializer(orden).data)
