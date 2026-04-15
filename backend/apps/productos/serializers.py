from rest_framework import serializers

from core.cloudinary_utils import (
    CloudinaryUploadError,
    upload_image,
    validate_image,
    with_delivery_transform,
)

from .models import Categoria, Marca, Producto, ProductoImagen, ProductoVariante


class CategoriaSerializer(serializers.ModelSerializer):
    hijas = serializers.SerializerMethodField()

    class Meta:
        model = Categoria
        fields = ["id", "nombre", "slug", "padre", "hijas"]
        read_only_fields = ["slug"]

    def get_hijas(self, obj):
        if obj.padre_id is None:
            return CategoriaSerializer(obj.hijas.all(), many=True).data
        return []


class MarcaSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Marca
        fields = ["id", "nombre", "logo", "logo_url", "logo_public_id"]
        read_only_fields = ["logo_url", "logo_public_id"]

    def _handle_logo(self, instance, logo):
        try:
            validate_image(logo)
            result = upload_image(
                logo, subfolder="marcas", public_id=f"marca_{instance.pk}"
            )
        except CloudinaryUploadError as exc:
            raise serializers.ValidationError({"logo": str(exc)})
        instance.logo_url = with_delivery_transform(result["secure_url"])
        instance.logo_public_id = result["public_id"]
        instance.save(update_fields=["logo_url", "logo_public_id"])

    def create(self, validated_data):
        logo = validated_data.pop("logo", None)
        instance = super().create(validated_data)
        if logo:
            self._handle_logo(instance, logo)
        return instance

    def update(self, instance, validated_data):
        logo = validated_data.pop("logo", None)
        instance = super().update(instance, validated_data)
        if logo:
            self._handle_logo(instance, logo)
        return instance


class ProductoImagenSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField(write_only=True, required=True)

    class Meta:
        model = ProductoImagen
        fields = [
            "id", "producto", "imagen", "imagen_url", "imagen_public_id",
            "orden", "es_principal",
        ]
        read_only_fields = ["imagen_url", "imagen_public_id"]

    def create(self, validated_data):
        imagen = validated_data.pop("imagen")
        try:
            validate_image(imagen)
        except CloudinaryUploadError as exc:
            raise serializers.ValidationError({"imagen": str(exc)})
        producto = validated_data["producto"]
        instance = ProductoImagen.objects.create(
            producto=producto,
            imagen_url="",
            orden=validated_data.get("orden", 0),
            es_principal=validated_data.get("es_principal", False),
        )
        try:
            result = upload_image(
                imagen,
                subfolder="productos",
                public_id=f"producto_{producto.pk}_img_{instance.pk}",
            )
        except CloudinaryUploadError as exc:
            instance.delete()
            raise serializers.ValidationError({"imagen": str(exc)})
        instance.imagen_url = with_delivery_transform(result["secure_url"])
        instance.imagen_public_id = result["public_id"]
        instance.save(update_fields=["imagen_url", "imagen_public_id"])
        return instance


class ProductoVarianteSerializer(serializers.ModelSerializer):
    precio_final = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = ProductoVariante
        fields = [
            "id", "producto", "talla", "color", "sku_variante",
            "precio_extra", "precio_final",
        ]


class ProductoListSerializer(serializers.ModelSerializer):
    categoria = serializers.StringRelatedField()
    marca = serializers.StringRelatedField()
    imagen_principal = serializers.SerializerMethodField()
    precio_final = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = Producto
        fields = [
            "id", "nombre", "sku", "precio", "precio_descuento", "precio_final",
            "estado", "categoria", "marca", "activo", "destacado",
            "imagen_principal", "created_at",
        ]

    def get_imagen_principal(self, obj):
        principal = next(
            (img for img in obj.imagenes.all() if img.es_principal), None
        )
        if not principal and obj.imagenes.all():
            principal = list(obj.imagenes.all())[0]
        return principal.imagen_url if principal else None


class ProductoDetailSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    marca = MarcaSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(), source="categoria", write_only=True
    )
    marca_id = serializers.PrimaryKeyRelatedField(
        queryset=Marca.objects.all(), source="marca", write_only=True
    )
    imagenes = ProductoImagenSerializer(many=True, read_only=True)
    variantes = ProductoVarianteSerializer(many=True, read_only=True)
    precio_final = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = Producto
        fields = [
            "id", "nombre", "descripcion", "precio", "precio_descuento", "precio_final",
            "sku", "estado", "categoria", "marca", "categoria_id", "marca_id",
            "activo", "destacado", "imagenes", "variantes",
            "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def validate(self, attrs):
        instance = self.instance
        activo = attrs.get("activo", getattr(instance, "activo", False))
        if activo and instance is not None:
            if instance.imagenes.count() < Producto.MIN_IMAGENES:
                raise serializers.ValidationError(
                    {
                        "activo": (
                            f"El producto debe tener al menos {Producto.MIN_IMAGENES} "
                            "imágenes para poder activarse (vistas frontal, trasera, "
                            "lateral y detalle)."
                        )
                    }
                )
        elif activo and instance is None:
            raise serializers.ValidationError(
                {
                    "activo": (
                        f"Crea primero el producto, sube {Producto.MIN_IMAGENES} "
                        "imágenes y luego actívalo."
                    )
                }
            )
        return attrs
