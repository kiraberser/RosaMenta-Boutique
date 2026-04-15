import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "rosa_menta.settings.development")

app = Celery("rosa_menta")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
