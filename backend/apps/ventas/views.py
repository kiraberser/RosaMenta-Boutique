from decimal import Decimal

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from core.permissions import IsAdmin

from .models import Venta
from .serializers import VentaSerializer
from .services import VentaError, registrar_venta


class VentaViewSet(viewsets.ModelViewSet):
    queryset = (
        Venta.objects
        .select_related("vendedor")
        .prefetch_related("items__variante__producto")
    )
    serializer_class = VentaSerializer
    permission_classes = [IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["metodo_pago", "vendedor"]
    search_fields = ["numero_ticket", "cliente_nombre"]
    ordering_fields = ["fecha", "total"]
    ordering = ["-fecha"]
    http_method_names = ["get", "post", "head", "options"]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            venta = registrar_venta(
                vendedor=request.user,
                metodo_pago=serializer.validated_data["metodo_pago"],
                items=serializer.validated_data["items_input"],
                descuento=serializer.validated_data.get("descuento", Decimal("0")),
                cliente_nombre=serializer.validated_data.get("cliente_nombre", ""),
                notas=serializer.validated_data.get("notas", ""),
            )
        except VentaError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(VentaSerializer(venta).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"], url_path="ticket")
    def ticket(self, request, pk=None):
        """Devuelve el ticket en JSON listo para imprimir desde el frontend."""
        venta = self.get_object()
        return Response({
            "numero_ticket": venta.numero_ticket,
            "fecha": venta.fecha,
            "vendedor": venta.vendedor.get_full_name() or venta.vendedor.username,
            "cliente": venta.cliente_nombre,
            "metodo_pago": venta.get_metodo_pago_display(),
            "items": [
                {
                    "producto": str(item.variante),
                    "sku": item.variante.sku_variante,
                    "cantidad": item.cantidad,
                    "precio_unitario": str(item.precio_unitario),
                    "subtotal": str(item.subtotal),
                }
                for item in venta.items.all()
            ],
            "subtotal": str(venta.subtotal),
            "descuento": str(venta.descuento),
            "total": str(venta.total),
            "notas": venta.notas,
        })
