"""Helpers para subir archivos a Cloudinary y guardar solo el endpoint (URL/public_id)."""
from typing import BinaryIO

import cloudinary.uploader
from django.conf import settings

ALLOWED_IMAGE_FORMATS = {"jpg", "jpeg", "png", "webp"}
MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB

DEFAULT_DELIVERY_TRANSFORM = "q_auto/f_auto"


def with_delivery_transform(secure_url: str, transform: str = DEFAULT_DELIVERY_TRANSFORM) -> str:
    """Inserta transformaciones de entrega después de `/upload/` (idempotente)."""
    if not secure_url or "/upload/" not in secure_url:
        return secure_url
    marker = f"/upload/{transform}/"
    if marker in secure_url:
        return secure_url
    return secure_url.replace("/upload/", marker, 1)


class CloudinaryUploadError(Exception):
    pass


def upload_image(file: BinaryIO, subfolder: str, public_id: str | None = None) -> dict:
    """
    Sube una imagen y devuelve dict con secure_url, public_id, format, bytes.
    El caller debe persistir solo `secure_url` (endpoint) y opcionalmente `public_id`.
    """
    folder = f"{settings.CLOUDINARY_UPLOAD_FOLDER}/{subfolder}".strip("/")
    try:
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            public_id=public_id,
            resource_type="image",
            overwrite=True,
            invalidate=True,
        )
    except Exception as exc:  # noqa: BLE001
        raise CloudinaryUploadError(str(exc)) from exc
    return {
        "secure_url": result.get("secure_url"),
        "public_id": result.get("public_id"),
        "format": result.get("format"),
        "bytes": result.get("bytes"),
        "width": result.get("width"),
        "height": result.get("height"),
    }


def delete_image(public_id: str) -> None:
    if not public_id:
        return
    cloudinary.uploader.destroy(public_id, invalidate=True)


def validate_image(file) -> None:
    size = getattr(file, "size", None)
    if size and size > MAX_IMAGE_SIZE_BYTES:
        raise CloudinaryUploadError("La imagen excede 5 MB.")
    name = getattr(file, "name", "") or ""
    ext = name.rsplit(".", 1)[-1].lower() if "." in name else ""
    if ext and ext not in ALLOWED_IMAGE_FORMATS:
        raise CloudinaryUploadError("Formato inválido. Usa jpg, png o webp.")
