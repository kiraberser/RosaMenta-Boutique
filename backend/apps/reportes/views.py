import csv
from datetime import timedelta

from django.db.models import Count, DecimalField, F, Sum, Value
from django.db.models.functions import Coalesce, TruncDay, TruncMonth, TruncWeek
from django.http import HttpResponse
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.inventario.models import MovimientoStock, Stock
from apps.newsletter.models import Suscriptor
from apps.pedidos.models import Pedido, PedidoItem
from apps.ventas.models import Venta, VentaItem
from core.permissions import IsAdmin

from .utils import rango_periodo


ZERO = Value(0, output_field=DecimalField(max_digits=14, decimal_places=2))


class VentasResumenView(APIView):
    """Totales agrupados (Pedido + Venta) en un periodo."""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        periodo = request.query_params.get("periodo", "mes")
        desde, hasta = rango_periodo(
            periodo,
            request.query_params.get("desde", ""),
            request.query_params.get("hasta", ""),
        )

        trunc_map = {"hoy": TruncDay, "semana": TruncDay, "mes": TruncDay}
        trunc = trunc_map.get(periodo, TruncMonth)

        pedidos = (
            Pedido.objects
            .filter(created_at__range=(desde, hasta))
            .exclude(estado=Pedido.Estado.CANCELADO)
            .annotate(bucket=trunc("created_at"))
            .values("bucket")
            .annotate(
                transacciones=Count("id"),
                subtotal=Coalesce(Sum("subtotal"), ZERO),
                descuento=Coalesce(Sum("descuento"), ZERO),
                total=Coalesce(Sum("total"), ZERO),
            )
        )
        ventas = (
            Venta.objects
            .filter(fecha__range=(desde, hasta))
            .annotate(bucket=trunc("fecha"))
            .values("bucket")
            .annotate(
                transacciones=Count("id"),
                subtotal=Coalesce(Sum("subtotal"), ZERO),
                descuento=Coalesce(Sum("descuento"), ZERO),
                total=Coalesce(Sum("total"), ZERO),
            )
        )

        totales_pedidos = Pedido.objects.filter(
            created_at__range=(desde, hasta)
        ).exclude(estado=Pedido.Estado.CANCELADO).aggregate(
            n=Count("id"),
            subtotal=Coalesce(Sum("subtotal"), ZERO),
            total=Coalesce(Sum("total"), ZERO),
        )
        totales_ventas = Venta.objects.filter(fecha__range=(desde, hasta)).aggregate(
            n=Count("id"),
            subtotal=Coalesce(Sum("subtotal"), ZERO),
            total=Coalesce(Sum("total"), ZERO),
        )

        return Response({
            "periodo": periodo,
            "desde": desde,
            "hasta": hasta,
            "pedidos_online": {
                "totales": totales_pedidos,
                "serie": list(pedidos),
            },
            "ventas_directas": {
                "totales": totales_ventas,
                "serie": list(ventas),
            },
            "gran_total": (
                (totales_pedidos["total"] or 0) + (totales_ventas["total"] or 0)
            ),
        })


class TopProductosView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        periodo = request.query_params.get("periodo", "mes")
        desde, hasta = rango_periodo(
            periodo,
            request.query_params.get("desde", ""),
            request.query_params.get("hasta", ""),
        )

        pedido_items = (
            PedidoItem.objects
            .filter(
                pedido__created_at__range=(desde, hasta),
            )
            .exclude(pedido__estado=Pedido.Estado.CANCELADO)
            .values(
                producto_id=F("variante__producto_id"),
                producto=F("variante__producto__nombre"),
                sku=F("variante__producto__sku"),
            )
            .annotate(
                cantidad=Sum("cantidad"),
                ingresos=Sum(F("cantidad") * F("precio_unitario")),
            )
        )
        venta_items = (
            VentaItem.objects
            .filter(venta__fecha__range=(desde, hasta))
            .values(
                producto_id=F("variante__producto_id"),
                producto=F("variante__producto__nombre"),
                sku=F("variante__producto__sku"),
            )
            .annotate(
                cantidad=Sum("cantidad"),
                ingresos=Sum(F("cantidad") * F("precio_unitario")),
            )
        )

        agregado: dict[int, dict] = {}
        for row in list(pedido_items) + list(venta_items):
            pid = row["producto_id"]
            entry = agregado.setdefault(pid, {
                "producto_id": pid,
                "producto": row["producto"],
                "sku": row["sku"],
                "cantidad": 0,
                "ingresos": 0,
            })
            entry["cantidad"] += row["cantidad"] or 0
            entry["ingresos"] += row["ingresos"] or 0

        productos = list(agregado.values())
        top_cantidad = sorted(productos, key=lambda x: x["cantidad"], reverse=True)[:10]
        top_ingresos = sorted(productos, key=lambda x: x["ingresos"], reverse=True)[:10]

        return Response({
            "periodo": periodo,
            "desde": desde,
            "hasta": hasta,
            "top_por_cantidad": top_cantidad,
            "top_por_ingresos": top_ingresos,
        })


class StockBajoView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        qs = (
            Stock.objects
            .select_related("variante__producto")
            .filter(cantidad__lte=F("stock_minimo"))
            .order_by("cantidad")
        )
        data = [{
            "stock_id": s.id,
            "producto": s.variante.producto.nombre,
            "sku": s.variante.producto.sku,
            "variante": str(s.variante),
            "sku_variante": s.variante.sku_variante,
            "cantidad": s.cantidad,
            "stock_minimo": s.stock_minimo,
            "faltante": max(s.stock_minimo - s.cantidad, 0),
        } for s in qs]
        return Response({"total": len(data), "items": data})


class MovimientosView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        params = request.query_params
        qs = MovimientoStock.objects.select_related(
            "variante__producto", "usuario"
        )
        if params.get("desde"):
            qs = qs.filter(fecha__gte=params["desde"])
        if params.get("hasta"):
            qs = qs.filter(fecha__lte=params["hasta"])
        if params.get("tipo"):
            qs = qs.filter(tipo=params["tipo"])
        if params.get("producto"):
            qs = qs.filter(variante__producto_id=params["producto"])
        if params.get("variante"):
            qs = qs.filter(variante_id=params["variante"])

        qs = qs.order_by("-fecha")[:500]
        data = [{
            "id": m.id,
            "fecha": m.fecha,
            "tipo": m.tipo,
            "tipo_display": m.get_tipo_display(),
            "cantidad": m.cantidad,
            "producto": m.variante.producto.nombre,
            "variante": str(m.variante),
            "usuario": m.usuario.username if m.usuario else None,
            "motivo": m.motivo,
            "referencia": m.referencia,
        } for m in qs]
        return Response({"total": len(data), "items": data})


class IngresosPorMetodoView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        periodo = request.query_params.get("periodo", "mes")
        desde, hasta = rango_periodo(
            periodo,
            request.query_params.get("desde", ""),
            request.query_params.get("hasta", ""),
        )

        pedidos = (
            Pedido.objects
            .filter(created_at__range=(desde, hasta))
            .exclude(estado=Pedido.Estado.CANCELADO)
            .values("metodo_pago")
            .annotate(
                transacciones=Count("id"),
                total=Coalesce(Sum("total"), ZERO),
            )
        )
        ventas = (
            Venta.objects
            .filter(fecha__range=(desde, hasta))
            .values("metodo_pago")
            .annotate(
                transacciones=Count("id"),
                total=Coalesce(Sum("total"), ZERO),
            )
        )

        return Response({
            "periodo": periodo,
            "desde": desde,
            "hasta": hasta,
            "pedidos_online": list(pedidos),
            "ventas_directas": list(ventas),
        })


class NewsletterMetricsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        ahora = timezone.localtime()
        inicio_mes = ahora.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        activos = Suscriptor.objects.filter(activo=True).count()
        inactivos = Suscriptor.objects.filter(activo=False).count()
        altas_mes = Suscriptor.objects.filter(
            fecha_suscripcion__gte=inicio_mes
        ).count()
        bajas_mes = Suscriptor.objects.filter(
            activo=False, fecha_baja__gte=inicio_mes
        ).count()
        por_origen = list(
            Suscriptor.objects.filter(activo=True)
            .values("origen")
            .annotate(total=Count("id"))
        )

        return Response({
            "activos": activos,
            "inactivos": inactivos,
            "altas_mes": altas_mes,
            "bajas_mes": bajas_mes,
            "por_origen": por_origen,
        })


class DashboardView(APIView):
    """Resumen único para la home del admin."""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        ahora = timezone.localtime()
        inicio_dia = ahora.replace(hour=0, minute=0, second=0, microsecond=0)
        inicio_mes = ahora.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        ventas_hoy_pedidos = Pedido.objects.filter(
            created_at__gte=inicio_dia
        ).exclude(estado=Pedido.Estado.CANCELADO).aggregate(
            total=Coalesce(Sum("total"), ZERO), n=Count("id")
        )
        ventas_hoy_directas = Venta.objects.filter(fecha__gte=inicio_dia).aggregate(
            total=Coalesce(Sum("total"), ZERO), n=Count("id")
        )
        ventas_mes_pedidos = Pedido.objects.filter(
            created_at__gte=inicio_mes
        ).exclude(estado=Pedido.Estado.CANCELADO).aggregate(
            total=Coalesce(Sum("total"), ZERO)
        )
        ventas_mes_directas = Venta.objects.filter(fecha__gte=inicio_mes).aggregate(
            total=Coalesce(Sum("total"), ZERO)
        )

        pendientes = Pedido.objects.filter(
            estado__in=[Pedido.Estado.CREADO, Pedido.Estado.PAGADO]
        ).count()
        stock_bajo = Stock.objects.filter(cantidad__lte=F("stock_minimo")).count()
        suscriptores = Suscriptor.objects.filter(activo=True).count()

        # Top 5 del mes (rápido — solo pedidos para no recorrer doble)
        top_mes = (
            PedidoItem.objects
            .filter(pedido__created_at__gte=inicio_mes)
            .exclude(pedido__estado=Pedido.Estado.CANCELADO)
            .values(producto=F("variante__producto__nombre"))
            .annotate(cantidad=Sum("cantidad"))
            .order_by("-cantidad")[:5]
        )

        return Response({
            "fecha": ahora,
            "ventas_hoy": {
                "total": (ventas_hoy_pedidos["total"] or 0) + (ventas_hoy_directas["total"] or 0),
                "transacciones": ventas_hoy_pedidos["n"] + ventas_hoy_directas["n"],
            },
            "ventas_mes": {
                "total": (ventas_mes_pedidos["total"] or 0) + (ventas_mes_directas["total"] or 0),
            },
            "pedidos_pendientes": pendientes,
            "stock_bajo": stock_bajo,
            "suscriptores_activos": suscriptores,
            "top5_mes": list(top_mes),
        })


class VentasExportCSVView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        periodo = request.query_params.get("periodo", "mes")
        desde, hasta = rango_periodo(
            periodo,
            request.query_params.get("desde", ""),
            request.query_params.get("hasta", ""),
        )

        response = HttpResponse(content_type="text/csv; charset=utf-8")
        response["Content-Disposition"] = (
            f'attachment; filename="ventas_{desde:%Y%m%d}_{hasta:%Y%m%d}.csv"'
        )
        writer = csv.writer(response)
        writer.writerow([
            "fecha", "tipo", "numero", "cliente", "metodo_pago",
            "subtotal", "descuento", "total", "vendedor",
        ])

        for p in (
            Pedido.objects
            .filter(created_at__range=(desde, hasta))
            .exclude(estado=Pedido.Estado.CANCELADO)
            .select_related("usuario")
        ):
            writer.writerow([
                p.created_at.isoformat(),
                "pedido",
                p.numero_pedido,
                p.usuario.get_full_name() or p.usuario.username,
                p.get_metodo_pago_display() if p.metodo_pago else "",
                p.subtotal, p.descuento, p.total,
                "",
            ])

        for v in (
            Venta.objects
            .filter(fecha__range=(desde, hasta))
            .select_related("vendedor")
        ):
            writer.writerow([
                v.fecha.isoformat(),
                "venta",
                v.numero_ticket,
                v.cliente_nombre,
                v.get_metodo_pago_display(),
                v.subtotal, v.descuento, v.total,
                v.vendedor.username,
            ])

        return response
