from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    """Custom user de Rosa y Menta."""
    phone = models.CharField(max_length=20, blank=True)
    # Endpoint Cloudinary del avatar (URL secure). El upload se hace vía core.cloudinary_utils.
    avatar_url = models.URLField(max_length=500, blank=True)
    avatar_public_id = models.CharField(max_length=255, blank=True)

    acepta_newsletter = models.BooleanField(
        default=False,
        help_text="Marcado en el formulario de registro — dispara alta en newsletter.",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

    def __str__(self) -> str:
        return self.get_full_name() or self.username or self.email


class Direccion(models.Model):
    MAX_POR_USUARIO = 3

    usuario = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name="direcciones"
    )
    calle = models.CharField(max_length=200)
    ciudad = models.CharField(max_length=100)
    cp = models.CharField(max_length=10)
    estado = models.CharField(max_length=100)
    pais = models.CharField(max_length=100, default="México")
    es_principal = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Dirección"
        verbose_name_plural = "Direcciones"
        ordering = ["-es_principal", "-created_at"]

    def __str__(self) -> str:
        return f"{self.calle}, {self.ciudad} ({self.usuario})"

    def save(self, *args, **kwargs):
        if self.es_principal:
            Direccion.objects.filter(usuario=self.usuario, es_principal=True).exclude(
                pk=self.pk
            ).update(es_principal=False)
        super().save(*args, **kwargs)
