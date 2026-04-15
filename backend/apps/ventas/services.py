"""Lógica transaccional de ventas — descuenta stock atómicamente."""
from decimal import Decimal

from django.db import transaction

from apps.inventario.models import MovimientoStock, Stock
from apps.inventario.services import registrar_movimiento

from .models import Venta, VentaItem


class VentaError(Exception):
    pass


@transaction.atomic
def registrar_venta(
    *,
    vendedor,
    metodo_pago: str,
    items: list[dict],
    descuento: Decimal = Decimal("0"),
    cliente_nombre: str = "",
    notas: str = "",
) -> Venta:
    """
    items: [{variante: ProductoVariante, cantidad: int, precio_unitario: Decimal}, ...]
    Valida stock, crea Venta + VentaItems, descuenta stock con MovimientoStock SAL.
    """
    if not items:
        raise VentaError("La venta debe tener al menos un item.")

    subtotal = Decimal("0")
    for it in items:
        if it["cantidad"] <= 0:
            raise VentaError("La cantidad debe ser positiva.")
        stock = Stock.objects.select_for_update().filter(variante=it["variante"]).first()
        disponible = stock.cantidad if stock else 0
        if disponible < it["cantidad"]:
            raise VentaError(
                f"Stock insuficiente para {it['variante']}: "
                f"{disponible} disponibles."
            )
        subtotal += it["precio_unitario"] * it["cantidad"]

    total = max(subtotal - descuento, Decimal("0"))

    venta = Venta.objects.create(
        vendedor=vendedor,
        metodo_pago=metodo_pago,
        subtotal=subtotal,
        descuento=descuento,
        total=total,
        cliente_nombre=cliente_nombre,
        notas=notas,
    )

    for it in items:
        VentaItem.objects.create(
            venta=venta,
            variante=it["variante"],
            cantidad=it["cantidad"],
            precio_unitario=it["precio_unitario"],
        )
        registrar_movimiento(
            variante=it["variante"],
            tipo=MovimientoStock.Tipo.SALIDA,
            cantidad=it["cantidad"],
            usuario=vendedor,
            motivo=f"Venta {venta.numero_ticket}",
            referencia=f"VEN#{venta.numero_ticket}",
        )

    return venta
