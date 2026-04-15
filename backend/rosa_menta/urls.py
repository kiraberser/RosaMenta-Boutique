from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)


def health(_request):
    return JsonResponse({"status": "ok"})


api_v1 = [
    path("health/", health, name="health"),
    path("auth/", include("apps.usuarios.urls")),
    path("catalogo/", include("apps.productos.urls")),
    path("inventario/", include("apps.inventario.urls")),
    path("", include("apps.pedidos.urls")),
    path("", include("apps.ventas.urls")),
    # path("pagos/", include("apps.pagos.urls")),
    path("newsletter/", include("apps.newsletter.urls")),
    path("reportes/", include("apps.reportes.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include((api_v1, "api_v1"))),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
