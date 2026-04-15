from rest_framework.routers import DefaultRouter

from .views import (
    CategoriaViewSet,
    MarcaViewSet,
    ProductoImagenViewSet,
    ProductoVarianteViewSet,
    ProductoViewSet,
)

router = DefaultRouter()
router.register(r"categorias", CategoriaViewSet, basename="categorias")
router.register(r"marcas", MarcaViewSet, basename="marcas")
router.register(r"productos", ProductoViewSet, basename="productos")
router.register(r"imagenes", ProductoImagenViewSet, basename="producto-imagenes")
router.register(r"variantes", ProductoVarianteViewSet, basename="producto-variantes")

urlpatterns = router.urls
