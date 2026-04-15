from rest_framework import serializers

from apps.productos.models import ProductoVariante

from .models import Venta, VentaItem


class VentaItemInputSerializer(serializers.Serializer):
    variante_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductoVariante.objects.all(), source="variante"
    )
    cantidad = serializers.IntegerField(min_value=1)
    precio_unitario = serializers.DecimalField(max_digits=10, decimal_places=2)


class VentaItemSerializer(serializers.ModelSerializer):
    variante_str = serializers.CharField(source="variante.__str__", read_only=True)
    sku_variante = serializers.CharField(source="variante.sku_variante", read_only=True)
    subtotal = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = VentaItem
        fields = [
            "id", "variante", "variante_str", "sku_variante",
            "cantidad", "precio_unitario", "subtotal",
        ]


class VentaSerializer(serializers.ModelSerializer):
    items = VentaItemSerializer(many=True, read_only=True)
    items_input = VentaItemInputSerializer(many=True, write_only=True)
    vendedor_username = serializers.CharField(
        source="vendedor.username", read_only=True
    )
    metodo_pago_display = serializers.CharField(
        source="get_metodo_pago_display", read_only=True
    )

    class Meta:
        model = Venta
        fields = [
            "id", "numero_ticket", "vendedor", "vendedor_username",
            "metodo_pago", "metodo_pago_display",
            "subtotal", "descuento", "total",
            "cliente_nombre", "notas",
            "items", "items_input", "fecha",
        ]
        read_only_fields = [
            "numero_ticket", "vendedor", "subtotal", "total", "fecha",
        ]
