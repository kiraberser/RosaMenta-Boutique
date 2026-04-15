from rest_framework import serializers

from .models import (
    MovimientoStock,
    OrdenCompra,
    OrdenCompraItem,
    Proveedor,
    Stock,
)


class StockSerializer(serializers.ModelSerializer):
    variante_str = serializers.CharField(source="variante.__str__", read_only=True)
    sku_variante = serializers.CharField(source="variante.sku_variante", read_only=True)
    es_bajo = serializers.BooleanField(read_only=True)

    class Meta:
        model = Stock
        fields = [
            "id", "variante", "variante_str", "sku_variante",
            "cantidad", "stock_minimo", "es_bajo", "updated_at",
        ]
        read_only_fields = ["updated_at"]


class MovimientoStockSerializer(serializers.ModelSerializer):
    variante_str = serializers.CharField(source="variante.__str__", read_only=True)
    usuario_username = serializers.CharField(source="usuario.username", read_only=True)

    class Meta:
        model = MovimientoStock
        fields = [
            "id", "variante", "variante_str", "tipo", "cantidad",
            "motivo", "referencia", "fecha", "usuario", "usuario_username",
        ]
        read_only_fields = ["fecha", "usuario", "usuario_username"]


class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = [
            "id", "nombre", "contacto", "email", "telefono",
            "productos", "activo", "created_at",
        ]
        read_only_fields = ["created_at"]


class OrdenCompraItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = OrdenCompraItem
        fields = ["id", "variante", "cantidad", "costo_unitario", "subtotal"]


class OrdenCompraSerializer(serializers.ModelSerializer):
    items = OrdenCompraItemSerializer(many=True)
    total = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )
    proveedor_nombre = serializers.CharField(source="proveedor.nombre", read_only=True)

    class Meta:
        model = OrdenCompra
        fields = [
            "id", "proveedor", "proveedor_nombre", "estado", "notas",
            "items", "total", "creada_por",
            "fecha_creacion", "fecha_confirmacion", "fecha_recepcion",
        ]
        read_only_fields = [
            "creada_por", "fecha_creacion", "fecha_confirmacion", "fecha_recepcion",
        ]

    def create(self, validated_data):
        items = validated_data.pop("items", [])
        request = self.context.get("request")
        if request:
            validated_data["creada_por"] = request.user
        orden = OrdenCompra.objects.create(**validated_data)
        for item in items:
            OrdenCompraItem.objects.create(orden=orden, **item)
        return orden

    def update(self, instance, validated_data):
        items = validated_data.pop("items", None)
        if instance.estado == OrdenCompra.Estado.RECIBIDO:
            raise serializers.ValidationError(
                "No se puede modificar una OC ya recibida."
            )
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if items is not None:
            instance.items.all().delete()
            for item in items:
                OrdenCompraItem.objects.create(orden=instance, **item)
        return instance
