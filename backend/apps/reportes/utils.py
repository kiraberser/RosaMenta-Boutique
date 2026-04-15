"""Helpers para parseo de rango de fechas en reportes."""
from datetime import datetime, time, timedelta

from django.utils import timezone


def rango_periodo(periodo: str = "mes", desde: str = "", hasta: str = ""):
    """Devuelve (desde_dt, hasta_dt) en zona local."""
    tz = timezone.get_current_timezone()
    ahora = timezone.localtime()

    if periodo == "rango" and desde and hasta:
        d = datetime.fromisoformat(desde)
        h = datetime.fromisoformat(hasta)
        if timezone.is_naive(d):
            d = timezone.make_aware(d, tz)
        if timezone.is_naive(h):
            h = timezone.make_aware(h, tz)
        return d, h

    if periodo == "hoy":
        inicio = timezone.make_aware(datetime.combine(ahora.date(), time.min), tz)
        return inicio, ahora

    if periodo == "semana":
        inicio_dia = ahora.date() - timedelta(days=ahora.weekday())
        inicio = timezone.make_aware(datetime.combine(inicio_dia, time.min), tz)
        return inicio, ahora

    # mes (default)
    inicio_dia = ahora.date().replace(day=1)
    inicio = timezone.make_aware(datetime.combine(inicio_dia, time.min), tz)
    return inicio, ahora
