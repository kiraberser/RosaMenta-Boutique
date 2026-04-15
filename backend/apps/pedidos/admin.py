from django.contrib import admin

from .models import Carrito, CarritoItem, Pedido, PedidoItem


class CarritoItemInline(admin.TabularInline):
    model = CarritoItem
    extra = 0


@admin.register(Carrito)
class CarritoAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "session_key", "creado_en")
    inlines = [CarritoItemInline]


class PedidoItemInline(admin.TabularInline):
    model = PedidoItem
    extra = 0
    readonly_fields = ("variante", "cantidad", "precio_unitario")


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ("numero_pedido", "usuario", "estado", "metodo_pago", "total", "created_at")
    list_filter = ("estado", "metodo_pago")
    search_fields = ("numero_pedido", "usuario__username", "usuario__email")
    inlines = [PedidoItemInline]
    date_hierarchy = "created_at"
    readonly_fields = ("numero_pedido", "subtotal", "total")
