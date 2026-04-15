from django.conf import settings
from django.db import models

from apps.productos.models import Producto, ProductoVariante


class Stock(models.Model):
    variante = models.OneToOneField(
        ProductoVariante, on_delete=models.CASCADE, related_name="stock"
    )
    cantidad = models.PositiveIntegerField(default=0)
    stock_minimo = models.PositiveIntegerField(default=0)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Stock"
        verbose_name_plural = "Stocks"

    def __str__(self) -> str:
        return f"{self.variante} → {self.cantidad}"

    @property
    def es_bajo(self) -> bool:
        return self.cantidad <= self.stock_minimo


class MovimientoStock(models.Model):
    class Tipo(models.TextChoices):
        ENTRADA = "ENT", "Entrada"
        SALIDA = "SAL", "Salida"
        AJUSTE = "AJU", "Ajuste"

    variante = models.ForeignKey(
        ProductoVariante, on_delete=models.PROTECT, related_name="movimientos"
    )
    tipo = models.CharField(max_length=3, choices=Tipo.choices)
    cantidad = models.IntegerField(help_text="Positivo siempre; el tipo define el signo.")
    motivo = models.CharField(max_length=200, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="movimientos_stock",
    )
    referencia = models.CharField(
        max_length=120, blank=True,
        help_text="Pedido, OC, ajuste manual…",
    )

    class Meta:
        verbose_name = "Movimiento de stock"
        verbose_name_plural = "Movimientos de stock"
        ordering = ["-fecha"]
        indexes = [
            models.Index(fields=["tipo", "fecha"]),
            models.Index(fields=["variante", "fecha"]),
        ]

    def __str__(self) -> str:
        return f"{self.tipo} {self.cantidad} · {self.variante}"


class Proveedor(models.Model):
    nombre = models.CharField(max_length=150, unique=True)
    contacto = models.CharField(max_length=120, blank=True)
    email = models.EmailField(blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    productos = models.ManyToManyField(
        Producto, related_name="proveedores", blank=True
    )

    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Proveedor"
        verbose_name_plural = "Proveedores"
        ordering = ["nombre"]

    def __str__(self) -> str:
        return self.nombre


class OrdenCompra(models.Model):
    class Estado(models.TextChoices):
        BORRADOR = "BOR", "Borrador"
        CONFIRMADO = "CON", "Confirmado"
        RECIBIDO = "REC", "Recibido"

    proveedor = models.ForeignKey(
        Proveedor, on_delete=models.PROTECT, related_name="ordenes_compra"
    )
    estado = models.CharField(max_length=3, choices=Estado.choices, default=Estado.BORRADOR)
    notas = models.TextField(blank=True)

    creada_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="ordenes_compra_creadas",
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_confirmacion = models.DateTimeField(null=True, blank=True)
    fecha_recepcion = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Orden de compra"
        verbose_name_plural = "Órdenes de compra"
        ordering = ["-fecha_creacion"]

    def __str__(self) -> str:
        return f"OC #{self.pk} · {self.proveedor} · {self.get_estado_display()}"

    @property
    def total(self):
        return sum((item.subtotal for item in self.items.all()), 0)


class OrdenCompraItem(models.Model):
    orden = models.ForeignKey(
        OrdenCompra, on_delete=models.CASCADE, related_name="items"
    )
    variante = models.ForeignKey(
        ProductoVariante, on_delete=models.PROTECT, related_name="oc_items"
    )
    cantidad = models.PositiveIntegerField()
    costo_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = "Item de OC"
        verbose_name_plural = "Items de OC"
        constraints = [
            models.UniqueConstraint(
                fields=["orden", "variante"], name="uniq_oc_variante"
            ),
        ]

    def __str__(self) -> str:
        return f"{self.cantidad}× {self.variante} @ {self.costo_unitario}"

    @property
    def subtotal(self):
        return self.cantidad * self.costo_unitario
