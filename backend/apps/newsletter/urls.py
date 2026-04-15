from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BajaView, SuscribirView, SuscriptorViewSet

router = DefaultRouter()
router.register(r"suscriptores", SuscriptorViewSet, basename="suscriptores")

urlpatterns = [
    path("suscribir/", SuscribirView.as_view(), name="newsletter-suscribir"),
    path("baja/", BajaView.as_view(), name="newsletter-baja"),
    path("", include(router.urls)),
]
