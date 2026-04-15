import logging

from celery import shared_task
from django.conf import settings
from django.template.loader import render_to_string

from core.brevo import send_transactional_email

logger = logging.getLogger(__name__)


@shared_task
def enviar_confirmacion_suscripcion(suscriptor_id: int) -> None:
    from .models import Suscriptor

    try:
        sub = Suscriptor.objects.get(pk=suscriptor_id)
    except Suscriptor.DoesNotExist:
        return

    contexto = {
        "nombre": sub.nombre or "amiga",
        "frontend_url": settings.FRONTEND_URL,
        "baja_url": f"{settings.FRONTEND_URL}/newsletter/baja?token={sub.token_baja}",
    }
    html = render_to_string("emails/confirmacion_suscripcion.html", contexto)
    texto = (
        f"¡Bienvenida al newsletter de Rosa y Menta! "
        f"Para darte de baja: {contexto['baja_url']}"
    )

    try:
        send_transactional_email(
            to_email=sub.email,
            to_name=sub.nombre or sub.email,
            subject="Te suscribiste al newsletter de Rosa y Menta",
            html_content=html,
            text_content=texto,
        )
    except Exception:
        logger.exception("Error enviando confirmación a %s", sub.email)
