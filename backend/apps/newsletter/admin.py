from django.contrib import admin

from .models import Suscriptor


@admin.register(Suscriptor)
class SuscriptorAdmin(admin.ModelAdmin):
    list_display = ("email", "nombre", "activo", "origen", "fecha_suscripcion", "fecha_baja")
    list_filter = ("activo", "origen")
    search_fields = ("email", "nombre")
    readonly_fields = ("token_baja", "fecha_suscripcion", "fecha_baja")
