from django.contrib import admin

from .models import Venta, VentaItem


class VentaItemInline(admin.TabularInline):
    model = VentaItem
    extra = 0
    readonly_fields = ("variante", "cantidad", "precio_unitario")


@admin.register(Venta)
class VentaAdmin(admin.ModelAdmin):
    list_display = ("numero_ticket", "vendedor", "metodo_pago", "total", "fecha")
    list_filter = ("metodo_pago",)
    search_fields = ("numero_ticket", "cliente_nombre", "vendedor__username")
    inlines = [VentaItemInline]
    date_hierarchy = "fecha"
    readonly_fields = ("numero_ticket", "subtotal", "total", "fecha")
