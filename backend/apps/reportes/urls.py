from django.urls import path

from .views import (
    DashboardView,
    IngresosPorMetodoView,
    MovimientosView,
    NewsletterMetricsView,
    StockBajoView,
    TopProductosView,
    VentasExportCSVView,
    VentasResumenView,
)

urlpatterns = [
    path("dashboard/", DashboardView.as_view(), name="rep-dashboard"),
    path("ventas/", VentasResumenView.as_view(), name="rep-ventas"),
    path("ventas/export.csv", VentasExportCSVView.as_view(), name="rep-ventas-csv"),
    path("top-productos/", TopProductosView.as_view(), name="rep-top-productos"),
    path("stock-bajo/", StockBajoView.as_view(), name="rep-stock-bajo"),
    path("movimientos/", MovimientosView.as_view(), name="rep-movimientos"),
    path("ingresos-por-metodo/", IngresosPorMetodoView.as_view(), name="rep-ingresos"),
    path("newsletter/", NewsletterMetricsView.as_view(), name="rep-newsletter"),
]
