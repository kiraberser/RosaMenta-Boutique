"""Lógica de negocio de pedidos."""
from decimal import Decimal

from django.db import transaction

from apps.inventario.models import MovimientoStock, Stock
from apps.inventario.services import registrar_movimiento
from apps.usuarios.models import Direccion

from .models import Carrito, CarritoItem, Pedido, PedidoItem


class PedidoError(Exception):
    pass


def get_or_create_carrito(*, usuario=None, session_key: str = "") -> Carrito:
    if usuario and usuario.is_authenticated:
        carrito, _ = Carrito.objects.get_or_create(usuario=usuario)
        return carrito
    if session_key:
        carrito, _ = Carrito.objects.get_or_create(
            usuario=None, session_key=session_key
        )
        return carrito
    raise PedidoError("Se requiere usuario autenticado o session_key.")


@transaction.atomic
def agregar_item(*, carrito: Carrito, variante, cantidad: int) -> CarritoItem:
    if cantidad <= 0:
        raise PedidoError("La cantidad debe ser positiva.")
    item, created = CarritoItem.objects.select_for_update().get_or_create(
        carrito=carrito,
        variante=variante,
        defaults={
            "cantidad": cantidad,
            "precio_snapshot": variante.precio_final,
        },
    )
    if not created:
        item.cantidad += cantidad
        item.precio_snapshot = variante.precio_final
        item.save(update_fields=["cantidad", "precio_snapshot"])
    return item


@transaction.atomic
def crear_pedido_desde_carrito(
    *,
    usuario,
    direccion_id: int,
    metodo_pago: str = "",
    descuento: Decimal = Decimal("0"),
    notas: str = "",
) -> Pedido:
    """Convierte un carrito en pedido. Atómico: valida stock, descuenta y vacía."""
    try:
        direccion = Direccion.objects.get(pk=direccion_id, usuario=usuario)
    except Direccion.DoesNotExist:
        raise PedidoError("Dirección inválida.")

    try:
        carrito = (
            Carrito.objects
            .select_for_update()
            .prefetch_related("items__variante")
            .get(usuario=usuario)
        )
    except Carrito.DoesNotExist:
        raise PedidoError("No tienes carrito.")

    items = list(carrito.items.select_related("variante").all())
    if not items:
        raise PedidoError("El carrito está vacío.")

    # Validar stock de cada variante antes de cualquier descuento
    for item in items:
        stock = Stock.objects.select_for_update().filter(variante=item.variante).first()
        disponible = stock.cantidad if stock else 0
        if disponible < item.cantidad:
            raise PedidoError(
                f"Stock insuficiente para {item.variante}: "
                f"disponible {disponible}, solicitado {item.cantidad}."
            )

    subtotal = sum((i.subtotal for i in items), Decimal("0"))
    total = max(subtotal - descuento, Decimal("0"))

    pedido = Pedido.objects.create(
        usuario=usuario,
        direccion=direccion,
        metodo_pago=metodo_pago,
        subtotal=subtotal,
        descuento=descuento,
        total=total,
        notas=notas,
    )

    for item in items:
        PedidoItem.objects.create(
            pedido=pedido,
            variante=item.variante,
            cantidad=item.cantidad,
            precio_unitario=item.precio_snapshot,
        )
        registrar_movimiento(
            variante=item.variante,
            tipo=MovimientoStock.Tipo.SALIDA,
            cantidad=item.cantidad,
            usuario=usuario,
            motivo=f"Pedido {pedido.numero_pedido}",
            referencia=f"PED#{pedido.numero_pedido}",
        )

    carrito.items.all().delete()

    # Email de confirmación — async vía Celery
    from .tasks import enviar_email_confirmacion
    transaction.on_commit(lambda: enviar_email_confirmacion.delay(pedido.pk))

    return pedido


@transaction.atomic
def cancelar_pedido(pedido_id: int, usuario=None, motivo: str = "") -> Pedido:
    pedido = Pedido.objects.select_for_update().get(pk=pedido_id)
    if pedido.estado in (Pedido.Estado.ENVIADO, Pedido.Estado.ENTREGADO):
        raise PedidoError("No se puede cancelar un pedido enviado o entregado.")
    if pedido.estado == Pedido.Estado.CANCELADO:
        return pedido

    for item in pedido.items.select_related("variante").all():
        registrar_movimiento(
            variante=item.variante,
            tipo=MovimientoStock.Tipo.ENTRADA,
            cantidad=item.cantidad,
            usuario=usuario,
            motivo=f"Cancelación pedido {pedido.numero_pedido} — {motivo}".strip(" —"),
            referencia=f"CANC#{pedido.numero_pedido}",
        )

    pedido.estado = Pedido.Estado.CANCELADO
    pedido.save(update_fields=["estado", "updated_at"])
    return pedido
