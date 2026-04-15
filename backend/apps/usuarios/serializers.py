from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from core.cloudinary_utils import (
    CloudinaryUploadError,
    upload_image,
    validate_image,
    with_delivery_transform,
)

from .models import Direccion, Usuario


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Permite login con email o username en el campo `username`."""

    def validate(self, attrs):
        identifier = attrs.get(self.username_field, "")
        if identifier and "@" in identifier:
            user = Usuario.objects.filter(email__iexact=identifier).first()
            if user:
                attrs[self.username_field] = user.username
        return super().validate(attrs)


class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = [
            "id",
            "calle",
            "ciudad",
            "cp",
            "estado",
            "pais",
            "es_principal",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, attrs):
        request = self.context.get("request")
        if request and request.method == "POST":
            usuario = request.user
            if (
                Direccion.objects.filter(usuario=usuario).count()
                >= Direccion.MAX_POR_USUARIO
            ):
                raise serializers.ValidationError(
                    f"Maximo {Direccion.MAX_POR_USUARIO} direcciones por usuario."
                )
        return attrs

    def create(self, validated_data):
        validated_data["usuario"] = self.context["request"].user
        return super().create(validated_data)


class UsuarioSerializer(serializers.ModelSerializer):
    direcciones = DireccionSerializer(many=True, read_only=True)
    avatar = serializers.ImageField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Usuario
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone",
            "avatar",
            "avatar_url",
            "is_staff",
            "acepta_newsletter",
            "direcciones",
            "date_joined",
        ]
        read_only_fields = ["id", "is_staff", "avatar_url", "date_joined"]

    def update(self, instance, validated_data):
        avatar = validated_data.pop("avatar", None)
        if avatar:
            try:
                validate_image(avatar)
                result = upload_image(
                    avatar,
                    subfolder="usuarios/avatars",
                    public_id=f"user_{instance.pk}",
                )
            except CloudinaryUploadError as exc:
                raise serializers.ValidationError({"avatar": str(exc)})
            instance.avatar_url = with_delivery_transform(result["secure_url"])
            instance.avatar_public_id = result["public_id"]
        return super().update(instance, validated_data)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "phone",
            "password",
            "password_confirm",
            "acepta_newsletter",
        ]
        extra_kwargs = {
            "email": {"required": True, "allow_blank": False},
            "first_name": {"required": True, "allow_blank": False},
        }

    def validate_email(self, value):
        if Usuario.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Ya existe una cuenta con este email.")
        return value.lower()

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password_confirm"):
            raise serializers.ValidationError({"password": "Las contrasenas no coinciden."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        usuario = Usuario(**validated_data)
        usuario.set_password(password)
        usuario.save()
        return usuario
