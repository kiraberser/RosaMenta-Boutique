from django.contrib import admin

from .models import Categoria, Marca, Producto, ProductoImagen, ProductoVariante


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "padre", "slug")
    list_filter = ("padre",)
    search_fields = ("nombre", "slug")
    prepopulated_fields = {"slug": ("nombre",)}


@admin.register(Marca)
class MarcaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "logo_url")
    search_fields = ("nombre",)


class ProductoImagenInline(admin.TabularInline):
    model = ProductoImagen
    extra = 0
    readonly_fields = ("imagen_url", "imagen_public_id")


class ProductoVarianteInline(admin.TabularInline):
    model = ProductoVariante
    extra = 0


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ("nombre", "sku", "precio", "precio_descuento", "estado", "activo", "destacado")
    list_filter = ("estado", "activo", "destacado", "categoria", "marca")
    search_fields = ("nombre", "sku", "descripcion")
    inlines = [ProductoImagenInline, ProductoVarianteInline]


admin.site.register(ProductoImagen)
admin.site.register(ProductoVariante)
