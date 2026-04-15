from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Direccion, Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ("username", "email", "first_name", "last_name", "is_staff", "acepta_newsletter")
    list_filter = ("is_staff", "is_superuser", "is_active", "acepta_newsletter")
    fieldsets = UserAdmin.fieldsets + (
        ("Rosa y Menta", {"fields": ("phone", "avatar_url", "avatar_public_id", "acepta_newsletter")}),
    )


@admin.register(Direccion)
class DireccionAdmin(admin.ModelAdmin):
    list_display = ("usuario", "calle", "ciudad", "cp", "estado", "es_principal")
    list_filter = ("estado", "es_principal")
    search_fields = ("usuario__username", "usuario__email", "calle", "cp")
