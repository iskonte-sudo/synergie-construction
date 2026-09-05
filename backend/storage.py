"""
Persistent storage helper for Synergie Construction.

Uses Cloudinary when CLOUDINARY_URL is configured.
Falls back to local disk when Cloudinary is unavailable.
"""

import logging
import os
from pathlib import Path
from typing import Optional, Tuple

import requests

logger = logging.getLogger(__name__)

APP_NAME = "synergie"

CLOUDINARY_URL = os.environ.get("CLOUDINARY_URL", "").strip()

_cloudinary_ready = False
_cloudinary_failed = False


def init_storage() -> Optional[bool]:
    """Initialize Cloudinary configuration."""
    global _cloudinary_ready, _cloudinary_failed

    if _cloudinary_ready:
        return True

    if _cloudinary_failed:
        return None

    if not CLOUDINARY_URL:
        logger.warning(
            "CLOUDINARY_URL not set — Cloudinary disabled, using local disk"
        )
        _cloudinary_failed = True
        return None

    try:
        import cloudinary

        cloudinary.config(secure=True)
        _cloudinary_ready = True
        logger.info("Cloudinary storage initialized")
        return True

    except Exception as e:
        logger.error(f"Cloudinary initialization failed: {e}")
        _cloudinary_failed = True
        return None


def storage_available() -> bool:
    return init_storage() is True


def _resource_type(content_type: str, path: str) -> str:
    """Determine Cloudinary resource type."""
    content_type = (content_type or "").lower()
    extension = path.rsplit(".", 1)[-1].lower() if "." in path else ""

    if content_type.startswith("video/") or extension in {
        "mp4",
        "webm",
        "mov",
        "avi",
        "mkv",
    }:
        return "video"

    if content_type.startswith("image/") or extension in {
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "svg",
        "avif",
    }:
        return "image"

    return "raw"


def put_object(path: str, data: bytes, content_type: str) -> Optional[dict]:
    """
    Upload bytes to Cloudinary.

    Returns:
        {'path': path, 'size': size, 'etag': etag}
    """
    if init_storage() is not True:
        return None

    try:
        import cloudinary.uploader

        resource_type = _resource_type(content_type, path)

        result = cloudinary.uploader.upload(
            data,
            public_id=path,
            resource_type=resource_type,
            overwrite=True,
            use_filename=False,
            unique_filename=False,
        )

        return {
            "path": path,
            "size": len(data),
            "etag": result.get("etag"),
            "url": result.get("secure_url"),
            "public_id": result.get("public_id"),
            "resource_type": result.get("resource_type"),
        }

    except Exception as e:
        logger.error(f"Cloudinary upload failed for {path}: {e}")
        return None


def get_object(path: str) -> Optional[Tuple[bytes, str]]:
    """
    Download an object from Cloudinary.

    Returns:
        (content, content_type)
    """
    if init_storage() is not True:
        return None

    try:
        import cloudinary.utils

        resource_type = _resource_type("", path)

        url, _ = cloudinary.utils.cloudinary_url(
            path,
            resource_type=resource_type,
            secure=True,
        )

        response = requests.get(url, timeout=120)

        if response.status_code == 404:
            return None

        response.raise_for_status()

        return (
            response.content,
            response.headers.get(
                "Content-Type",
                guess_content_type(path),
            ),
        )

    except Exception as e:
        logger.warning(f"Cloudinary GET failed for {path}: {e}")
        return None


def make_storage_path(folder: str, filename: str) -> str:
    """Canonical storage path."""
    folder = (folder or "general").strip("/") or "general"
    return f"{APP_NAME}/uploads/{folder}/{filename}"


def guess_content_type(filename: str) -> str:
    ext = (
        filename.rsplit(".", 1)[-1].lower()
        if "." in filename
        else ""
    )

    return {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "gif": "image/gif",
        "webp": "image/webp",
        "svg": "image/svg+xml",
        "avif": "image/avif",
        "mp4": "video/mp4",
        "webm": "video/webm",
        "mov": "video/quicktime",
        "pdf": "application/pdf",
    }.get(ext, "application/octet-stream")


def local_uploads_dir() -> Path:
    """Legacy local disk uploads location."""
    return Path(__file__).parent / "uploads"
