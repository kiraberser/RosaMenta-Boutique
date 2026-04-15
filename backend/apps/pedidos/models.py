import uuid

from django.conf import settings
from django.db import models

from apps.productos.models import ProductoVariante


class Carrito(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.CASCADE,
        related_name="carritos",
    )
    session_key = models.CharField(max_length=64, blank=True, db_index=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Carrito"
        verbose_name_plural = "Carritos"
        constraints = [
            models.UniqueConstraint(
                fields=["usuario"],
                condition=models.Q(usuario__isnull=False),
                name="uniq_carrito_por_usuario",
            ),
        ]

    def __str__(self) -> str:
        return f"Carrito #{self.pk} ({self.usuario or self.session_key or 'anon'})"

    @property
    def subtotal(self):
        return sum((item.subtotal for item in self.items.all()), 0)


class CarritoItem(models.Model):
    carrito = models.ForeignKey(
        Carrito, on_delete=models.CASCADE, related_name="items"
    )
    variante = models.ForeignKey(
        ProductoVariante, on_delete=models.PROTECT, related_name="carrito_items"
    )
    cantidad = models.PositiveIntegerField(default=1)
    precio_snapshot = models.DecimalField(max_digits=10, decimal_places=2)

    agregado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Item de carrito"
        verbose_name_plural = "Items de carrito"
        constraints = [
            models.UniqueConstraint(
                fields=["carrito", "variante"], name="uniq_carrito_variante"
            ),
        ]

    def __str__(self) -> str:
        return f"{self.cantidad}× {self.variante}"

    @property
    def subtotal(self):
        return self.cantidad * self.precio_snapshot


class Pedido(models.Model):
    class Estado(models.TextChoices):
        CREADO = "CRE", "Creado"
        PAGADO = "PAG", "Pagado"
        ENVIADO = "ENV", "Enviado"
        ENTREGADO = "ENT", "Entregado"
        CANCELADO = "CAN", "Cancelado"

    class MetodoPago(models.TextChoices):
        MERCADOPAGO = "MP", "MercadoPago"
        EFECTIVO = "EFE", "Efectivo"
        TRANSFERENCIA = "TRA", "Transferencia"

    numero_pedido = models.CharField(max_length=12, unique=True, editable=False)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="pedidos",
    )
    direccion = models.ForeignKey(
        "usuarios.Direccion",
        on_delete=models.PROTECT,
        related_name="pedidos",
    )

    estado = models.CharField(max_length=3, choices=Estado.choices, default=Estado.CREADO)
    metodo_pago = models.CharField(
        max_length=3, choices=MetodoPago.choices, blank=True
    )

    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    descuento = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    notas = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Pedido"
        verbose_name_plural = "Pedidos"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["estado", "created_at"]),
            models.Index(fields=["usuario", "estado"]),
        ]

    def __str__(self) -> str:
        return f"Pedido {self.numero_pedido} · {self.get_estado_display()}"

    def save(self, *args, **kwargs):
        if not self.numero_pedido:
            self.numero_pedido = uuid.uuid4().hex[:10].upper()
        super().save(*args, **kwargs)


class PedidoItem(models.Model):
    pedido = models.ForeignKey(
        Pedido, on_delete=models.CASCADE, related_name="items"
    )
    variante = models.ForeignKey(
        ProductoVariante, on_delete=models.PROTECT, related_name="pedido_items"
    )
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = "Item de pedido"
        verbose_name_plural = "Items de pedido"

    def __str__(self) -> str:
        return f"{self.cantidad}× {self.variante} @ {self.precio_unitario}"

    @property
    def subtotal(self):
        return self.cantidad * self.precio_unitario
