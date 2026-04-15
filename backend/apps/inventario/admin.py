from django.contrib import admin

from .models import (
    MovimientoStock,
    OrdenCompra,
    OrdenCompraItem,
    Proveedor,
    Stock,
)


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ("variante", "cantidad", "stock_minimo", "es_bajo", "updated_at")
    list_filter = ("variante__producto__categoria",)
    search_fields = ("variante__sku_variante", "variante__producto__nombre")


@admin.register(MovimientoStock)
class MovimientoStockAdmin(admin.ModelAdmin):
    list_display = ("variante", "tipo", "cantidad", "motivo", "usuario", "fecha")
    list_filter = ("tipo",)
    search_fields = ("variante__sku_variante", "motivo", "referencia")
    date_hierarchy = "fecha"


@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ("nombre", "contacto", "email", "activo")
    list_filter = ("activo",)
    search_fields = ("nombre", "contacto", "email")
    filter_horizontal = ("productos",)


class OrdenCompraItemInline(admin.TabularInline):
    model = OrdenCompraItem
    extra = 0


@admin.register(OrdenCompra)
class OrdenCompraAdmin(admin.ModelAdmin):
    list_display = ("id", "proveedor", "estado", "fecha_creacion", "fecha_recepcion")
    list_filter = ("estado", "proveedor")
    inlines = [OrdenCompraItemInline]
    date_hierarchy = "fecha_creacion"
