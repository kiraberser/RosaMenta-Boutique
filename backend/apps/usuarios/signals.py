from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Usuario
from .tasks import enviar_bienvenida


@receiver(post_save, sender=Usuario)
def usuario_post_save(sender, instance: Usuario, created: bool, **kwargs):
    if not created:
        return

    enviar_bienvenida.delay(instance.pk)

    if instance.acepta_newsletter and instance.email:
        try:
            from apps.newsletter.models import Suscriptor
        except Exception:
            return
        Suscriptor.objects.update_or_create(
            email=instance.email,
            defaults={
                "nombre": instance.get_full_name() or instance.username,
                "activo": True,
                "origen": "REG",
                "fecha_baja": None,
            },
        )
