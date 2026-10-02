import uuid
import os
from django.utils.text import slugify
from django.db import models

def event_image_path(instance, filename):
    ext = filename.split('.')[-1]
    name = slugify(instance.name)
    filename = f"{name}-{uuid.uuid4()}.{ext}"
    return os.path.join("disciplines", filename)

class Discipline(models.Model):
    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to=event_image_path)
