from rest_framework.routers import DefaultRouter

from .views import (
    MovimientoStockViewSet,
    OrdenCompraViewSet,
    ProveedorViewSet,
    StockViewSet,
)

router = DefaultRouter()
router.register(r"stock", StockViewSet, basename="stock")
router.register(r"movimientos", MovimientoStockViewSet, basename="movimientos")
router.register(r"proveedores", ProveedorViewSet, basename="proveedores")
router.register(r"ordenes-compra", OrdenCompraViewSet, basename="ordenes-compra")

urlpatterns = router.urls
