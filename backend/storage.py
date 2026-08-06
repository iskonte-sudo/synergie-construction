"""
Emergent Object Storage helper.

Persistent object storage backing for user uploads. Falls back to local disk
if storage init fails (e.g. in preview without EMERGENT_LLM_KEY set).
"""
import os
import logging
import requests
from pathlib import Path
from typing import Tuple, Optional

logger = logging.getLogger(__name__)

APP_NAME = "synergie"

STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")

_storage_key: Optional[str] = None
_init_failed = False  # once True, we stop retrying on every request


def init_storage() -> Optional[str]:
    """Initialize the object storage session key. Idempotent. Returns None on failure."""
    global _storage_key, _init_failed
    if _storage_key:
        return _storage_key
    if _init_failed:
        return None
    if not EMERGENT_KEY:
        logger.warning("EMERGENT_LLM_KEY not set — object storage disabled, falling back to local disk")
        _init_failed = True
        return None
    try:
        resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
        resp.raise_for_status()
        _storage_key = resp.json()["storage_key"]
        logger.info("Object storage initialized")
        return _storage_key
    except Exception as e:
        logger.error(f"Object storage init failed: {e}")
        _init_failed = True
        return None


def storage_available() -> bool:
    return init_storage() is not None


def put_object(path: str, data: bytes, content_type: str) -> Optional[dict]:
    """Upload bytes. Returns {'path','size','etag'} or None on failure."""
    key = init_storage()
    if not key:
        return None
    try:
        resp = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key, "Content-Type": content_type or "application/octet-stream"},
            data=data,
            timeout=180,
        )
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        logger.error(f"Object storage PUT failed for {path}: {e}")
        return None


def get_object(path: str) -> Optional[Tuple[bytes, str]]:
    """Download bytes. Returns (content, content_type) or None if not found."""
    key = init_storage()
    if not key:
        return None
    try:
        resp = requests.get(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key},
            timeout=120,
        )
        if resp.status_code == 404:
            return None
        resp.raise_for_status()
        return resp.content, resp.headers.get("Content-Type", "application/octet-stream")
    except Exception as e:
        logger.warning(f"Object storage GET failed for {path}: {e}")
        return None


def make_storage_path(folder: str, filename: str) -> str:
    """Canonical path in object storage: '{app}/uploads/{folder}/{filename}' — no leading slash."""
    folder = (folder or "general").strip("/") or "general"
    return f"{APP_NAME}/uploads/{folder}/{filename}"


def guess_content_type(filename: str) -> str:
    ext = (filename.rsplit(".", 1)[-1] if "." in filename else "").lower()
    return {
        "jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
        "gif": "image/gif", "webp": "image/webp", "svg": "image/svg+xml",
        "mp4": "video/mp4", "webm": "video/webm", "mov": "video/quicktime",
        "pdf": "application/pdf",
    }.get(ext, "application/octet-stream")


def local_uploads_dir() -> Path:
    """Legacy local disk uploads location (used for previously-uploaded files)."""
    return Path(__file__).parent / "uploads"
