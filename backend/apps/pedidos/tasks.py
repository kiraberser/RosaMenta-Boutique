import logging

from celery import shared_task
from django.conf import settings
from django.template.loader import render_to_string

from core.brevo import send_transactional_email

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def enviar_email_confirmacion(self, pedido_id: int) -> None:
    from .models import Pedido

    try:
        pedido = (
            Pedido.objects
            .select_related("usuario", "direccion")
            .prefetch_related("items__variante__producto")
            .get(pk=pedido_id)
        )
    except Pedido.DoesNotExist:
        logger.warning("Pedido %s no existe.", pedido_id)
        return

    usuario = pedido.usuario
    if not usuario.email:
        return

    contexto = {
        "pedido": pedido,
        "usuario": usuario,
        "items": list(pedido.items.all()),
        "frontend_url": settings.FRONTEND_URL,
        "detalle_url": f"{settings.FRONTEND_URL}/cuenta/pedidos/{pedido.numero_pedido}",
    }
    html = render_to_string("emails/pedido_confirmacion.html", contexto)
    texto = (
        f"Tu pedido {pedido.numero_pedido} fue creado. "
        f"Total: ${pedido.total}. Detalle: {contexto['detalle_url']}"
    )

    try:
        send_transactional_email(
            to_email=usuario.email,
            to_name=usuario.get_full_name() or usuario.username,
            subject=f"Confirmación de pedido {pedido.numero_pedido} · Rosa y Menta",
            html_content=html,
            text_content=texto,
        )
    except Exception as exc:  # noqa: BLE001
        logger.exception("Error enviando confirmación de pedido %s", pedido_id)
        raise self.retry(exc=exc)
