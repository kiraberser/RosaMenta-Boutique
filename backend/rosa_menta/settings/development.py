"""Development settings."""
import dj_database_url

from .base import *  # noqa

DEBUG = True
ALLOWED_HOSTS = ["*"]

DATABASES = {
    "default": dj_database_url.config(
        default=env(
            "DATABASE_URL",
            default=f"postgres://{env('DB_USER', default='postgres')}:"
                    f"{env('DB_PASSWORD', default='postgres')}@"
                    f"{env('DB_HOST', default='localhost')}:"
                    f"{env('DB_PORT', default='5432')}/"
                    f"{env('DB_NAME', default='rosa_menta')}",
        ),
        conn_max_age=600,
    )
}

# Si DATABASE_URL no está y queremos fallback rápido a sqlite, descomentar:
# DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": BASE_DIR / "db.sqlite3"}}

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Sin SSL/HSTS en desarrollo
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
