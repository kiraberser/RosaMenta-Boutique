import logging

from celery import shared_task
from django.conf import settings
from django.template.loader import render_to_string

from core.brevo import send_transactional_email

from .models import Usuario

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def enviar_bienvenida(self, usuario_id: int) -> None:
    try:
        usuario = Usuario.objects.get(pk=usuario_id)
    except Usuario.DoesNotExist:
        logger.warning("Usuario %s no existe — bienvenida cancelada.", usuario_id)
        return

    if not usuario.email:
        return

    contexto = {
        "nombre": usuario.first_name or usuario.username,
        "frontend_url": settings.FRONTEND_URL,
        "catalogo_url": f"{settings.FRONTEND_URL}/tienda",
        "cuenta_url": f"{settings.FRONTEND_URL}/cuenta",
    }
    html = render_to_string("emails/bienvenida.html", contexto)
    texto = (
        f"Hola {contexto['nombre']}, bienvenida a Rosa y Menta. "
        f"Explora el catálogo en {contexto['catalogo_url']}"
    )

    try:
        send_transactional_email(
            to_email=usuario.email,
            to_name=usuario.get_full_name() or usuario.username,
            subject="Bienvenida a Rosa y Menta",
            html_content=html,
            text_content=texto,
        )
    except Exception as exc:  # noqa: BLE001
        logger.exception("Error enviando bienvenida a %s", usuario.email)
        raise self.retry(exc=exc)
