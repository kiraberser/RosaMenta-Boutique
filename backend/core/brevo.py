"""Cliente Brevo (Sendinblue) para emails transaccionales."""
import logging

import sib_api_v3_sdk
from django.conf import settings
from sib_api_v3_sdk.rest import ApiException

logger = logging.getLogger(__name__)


def _client() -> sib_api_v3_sdk.TransactionalEmailsApi:
    config = sib_api_v3_sdk.Configuration()
    config.api_key["api-key"] = settings.BREVO_API_KEY
    return sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(config))


def send_transactional_email(
    *,
    to_email: str,
    to_name: str,
    subject: str,
    html_content: str,
    text_content: str | None = None,
) -> dict:
    if not settings.BREVO_API_KEY:
        logger.warning("BREVO_API_KEY no configurada — email a %s no enviado.", to_email)
        return {"skipped": True}

    payload = sib_api_v3_sdk.SendSmtpEmail(
        sender={"email": settings.BREVO_SENDER_EMAIL, "name": settings.BREVO_SENDER_NAME},
        to=[{"email": to_email, "name": to_name or to_email}],
        subject=subject,
        html_content=html_content,
        text_content=text_content,
    )
    try:
        response = _client().send_transac_email(payload)
        return response.to_dict() if hasattr(response, "to_dict") else {"sent": True}
    except ApiException:
        logger.exception("Brevo API error enviando a %s", to_email)
        raise
