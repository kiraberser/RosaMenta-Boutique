from rest_framework import serializers

from apps.productos.models import ProductoVariante

from .models import Carrito, CarritoItem, Pedido, PedidoItem


class CarritoItemSerializer(serializers.ModelSerializer):
    variante_str = serializers.CharField(source="variante.__str__", read_only=True)
    subtotal = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = CarritoItem
        fields = [
            "id", "variante", "variante_str", "cantidad",
            "precio_snapshot", "subtotal", "agregado_en",
        ]
        read_only_fields = ["precio_snapshot", "agregado_en"]


class CarritoSerializer(serializers.ModelSerializer):
    items = CarritoItemSerializer(many=True, read_only=True)
    subtotal = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = Carrito
        fields = ["id", "usuario", "session_key", "items", "subtotal", "creado_en"]
        read_only_fields = ["usuario", "session_key", "creado_en"]


class AgregarItemSerializer(serializers.Serializer):
    variante_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductoVariante.objects.all(), source="variante"
    )
    cantidad = serializers.IntegerField(min_value=1, default=1)


class PedidoItemSerializer(serializers.ModelSerializer):
    variante_str = serializers.CharField(source="variante.__str__", read_only=True)
    subtotal = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = PedidoItem
        fields = [
            "id", "variante", "variante_str", "cantidad",
            "precio_unitario", "subtotal",
        ]


class PedidoSerializer(serializers.ModelSerializer):
    items = PedidoItemSerializer(many=True, read_only=True)
    estado_display = serializers.CharField(source="get_estado_display", read_only=True)
    metodo_pago_display = serializers.CharField(
        source="get_metodo_pago_display", read_only=True
    )

    class Meta:
        model = Pedido
        fields = [
            "id", "numero_pedido", "usuario", "direccion",
            "estado", "estado_display", "metodo_pago", "metodo_pago_display",
            "subtotal", "descuento", "total", "notas",
            "items", "created_at", "updated_at",
        ]
        read_only_fields = [
            "numero_pedido", "usuario", "subtotal", "total",
            "created_at", "updated_at",
        ]


class CrearPedidoSerializer(serializers.Serializer):
    direccion_id = serializers.IntegerField()
    metodo_pago = serializers.ChoiceField(
        choices=Pedido.MetodoPago.choices, required=False, allow_blank=True
    )
    descuento = serializers.DecimalField(
        max_digits=12, decimal_places=2, required=False, default=0
    )
    notas = serializers.CharField(required=False, allow_blank=True)
