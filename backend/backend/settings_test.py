from .settings import *
import tempfile
from pathlib import Path

MEDIA_ROOT = Path(tempfile.mkdtemp())

