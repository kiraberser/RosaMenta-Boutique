from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsAdmin

from .models import Suscriptor
from .serializers import SuscribirSerializer, SuscriptorSerializer
from .tasks import enviar_confirmacion_suscripcion


class SuscribirView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SuscribirSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].lower()
        nombre = serializer.validated_data.get("nombre", "")
        origen = serializer.validated_data.get("origen", Suscriptor.Origen.FORMULARIO)

        sub, created = Suscriptor.objects.get_or_create(
            email=email,
            defaults={"nombre": nombre, "origen": origen, "activo": True},
        )

        if not created:
            if sub.activo:
                return Response(
                    {"detail": "Ya estás suscrita.", "id": sub.id},
                    status=status.HTTP_200_OK,
                )
            sub.activo = True
            sub.fecha_baja = None
            if nombre and not sub.nombre:
                sub.nombre = nombre
            sub.save(update_fields=["activo", "fecha_baja", "nombre"])

        enviar_confirmacion_suscripcion.delay(sub.pk)
        return Response(
            {"detail": "Suscripción confirmada.", "id": sub.id},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class BajaView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.query_params.get("token")
        if not token:
            return Response(
                {"detail": "Falta el token."}, status=status.HTTP_400_BAD_REQUEST
            )
        try:
            sub = Suscriptor.objects.get(token_baja=token)
        except (Suscriptor.DoesNotExist, ValueError):
            return Response(
                {"detail": "Token inválido."}, status=status.HTTP_404_NOT_FOUND
            )

        if sub.activo:
            sub.activo = False
            sub.fecha_baja = timezone.now()
            sub.save(update_fields=["activo", "fecha_baja"])

        return Response(
            {"detail": "Suscripción cancelada. Lamentamos verte partir."},
            status=status.HTTP_200_OK,
        )


class SuscriptorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Suscriptor.objects.all()
    serializer_class = SuscriptorSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ["activo", "origen"]
    search_fields = ["email", "nombre"]
