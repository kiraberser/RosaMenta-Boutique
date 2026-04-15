import uuid

from django.db import models


class Suscriptor(models.Model):
    class Origen(models.TextChoices):
        REGISTRO = "REG", "Registro"
        FORMULARIO = "FORM", "Formulario"

    email = models.EmailField(unique=True)
    nombre = models.CharField(max_length=150, blank=True)
    activo = models.BooleanField(default=True)
    token_baja = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    origen = models.CharField(max_length=4, choices=Origen.choices, default=Origen.FORMULARIO)

    fecha_suscripcion = models.DateTimeField(auto_now_add=True)
    fecha_baja = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Suscriptor"
        verbose_name_plural = "Suscriptores"
        ordering = ["-fecha_suscripcion"]
        indexes = [
            models.Index(fields=["activo"]),
            models.Index(fields=["origen", "activo"]),
        ]

    def __str__(self) -> str:
        return f"{self.email} ({'activo' if self.activo else 'baja'})"
