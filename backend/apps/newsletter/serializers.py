from rest_framework import serializers

from .models import Suscriptor


class SuscribirSerializer(serializers.Serializer):
    email = serializers.EmailField()
    nombre = serializers.CharField(max_length=150, required=False, allow_blank=True)
    origen = serializers.ChoiceField(
        choices=Suscriptor.Origen.choices, default=Suscriptor.Origen.FORMULARIO
    )


class SuscriptorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suscriptor
        fields = [
            "id", "email", "nombre", "activo", "origen",
            "fecha_suscripcion", "fecha_baja",
        ]
        read_only_fields = ["fecha_suscripcion", "fecha_baja"]
