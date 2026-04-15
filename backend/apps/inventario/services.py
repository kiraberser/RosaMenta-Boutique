"""Lógica de negocio de inventario — todas las operaciones que tocan Stock."""
from django.db import transaction
from django.utils import timezone

from .models import MovimientoStock, OrdenCompra, Stock


class InventarioError(Exception):
    pass


@transaction.atomic
def registrar_movimiento(
    *, variante, tipo: str, cantidad: int, usuario=None, motivo: str = "",
    referencia: str = "",
) -> MovimientoStock:
    """Aplica un movimiento ENT/SAL/AJU y actualiza Stock atómicamente."""
    if cantidad <= 0 and tipo != MovimientoStock.Tipo.AJUSTE:
        raise InventarioError("La cantidad debe ser positiva.")

    stock, _ = Stock.objects.select_for_update().get_or_create(variante=variante)

    if tipo == MovimientoStock.Tipo.ENTRADA:
        stock.cantidad += cantidad
    elif tipo == MovimientoStock.Tipo.SALIDA:
        if stock.cantidad < cantidad:
            raise InventarioError(
                f"Stock insuficiente para {variante}: {stock.cantidad} < {cantidad}"
            )
        stock.cantidad -= cantidad
    elif tipo == MovimientoStock.Tipo.AJUSTE:
        stock.cantidad = max(stock.cantidad + cantidad, 0)
    else:
        raise InventarioError(f"Tipo de movimiento desconocido: {tipo}")

    stock.save(update_fields=["cantidad", "updated_at"])

    return MovimientoStock.objects.create(
        variante=variante,
        tipo=tipo,
        cantidad=abs(cantidad),
        motivo=motivo,
        usuario=usuario,
        referencia=referencia,
    )


@transaction.atomic
def confirmar_recepcion_orden(orden_id: int, usuario=None) -> OrdenCompra:
    """Confirma recepción de OC: suma Stock + MovimientoStock ENT por cada item."""
    orden = (
        OrdenCompra.objects
        .select_for_update()
        .prefetch_related("items__variante")
        .get(pk=orden_id)
    )

    if orden.estado == OrdenCompra.Estado.RECIBIDO:
        raise InventarioError("La orden ya fue recibida.")
    if orden.estado not in (OrdenCompra.Estado.BORRADOR, OrdenCompra.Estado.CONFIRMADO):
        raise InventarioError(f"Estado inválido: {orden.estado}")

    for item in orden.items.all():
        registrar_movimiento(
            variante=item.variante,
            tipo=MovimientoStock.Tipo.ENTRADA,
            cantidad=item.cantidad,
            usuario=usuario,
            motivo=f"Recepción OC #{orden.pk}",
            referencia=f"OC#{orden.pk}",
        )

    orden.estado = OrdenCompra.Estado.RECIBIDO
    orden.fecha_recepcion = timezone.now()
    orden.save(update_fields=["estado", "fecha_recepcion"])
    return orden
