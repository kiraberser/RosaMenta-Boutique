import uuid

from django.conf import settings
from django.db import models

from apps.productos.models import ProductoVariante


class Venta(models.Model):
    """Registro de venta gestionado desde el frontend (POS web)."""

    class MetodoPago(models.TextChoices):
        EFECTIVO = "EFE", "Efectivo"
        TARJETA = "TAR", "Tarjeta"
        TRANSFERENCIA = "TRA", "Transferencia"

    numero_ticket = models.CharField(max_length=12, unique=True, editable=False)
    vendedor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="ventas",
    )
    metodo_pago = models.CharField(max_length=3, choices=MetodoPago.choices)

    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    descuento = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    cliente_nombre = models.CharField(max_length=150, blank=True)
    notas = models.TextField(blank=True)

    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Venta"
        verbose_name_plural = "Ventas"
        ordering = ["-fecha"]
        indexes = [
            models.Index(fields=["fecha"]),
            models.Index(fields=["vendedor", "fecha"]),
            models.Index(fields=["metodo_pago"]),
        ]

    def __str__(self) -> str:
        return f"Ticket {self.numero_ticket} · ${self.total}"

    def save(self, *args, **kwargs):
        if not self.numero_ticket:
            self.numero_ticket = uuid.uuid4().hex[:10].upper()
        super().save(*args, **kwargs)


class VentaItem(models.Model):
    venta = models.ForeignKey(
        Venta, on_delete=models.CASCADE, related_name="items"
    )
    variante = models.ForeignKey(
        ProductoVariante, on_delete=models.PROTECT, related_name="venta_items"
    )
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = "Item de venta"
        verbose_name_plural = "Items de venta"

    def __str__(self) -> str:
        return f"{self.cantidad}× {self.variante} @ {self.precio_unitario}"

    @property
    def subtotal(self):
        return self.cantidad * self.precio_unitario
