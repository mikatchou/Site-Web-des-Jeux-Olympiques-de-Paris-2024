from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class CustomUser(AbstractUser):
    
    email = models.EmailField(null=False, blank=False)
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)
    birth = models.DateField(null=False, blank=False)
    phone = models.CharField(max_length=20, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=False)
    city = models.CharField(max_length=100, null=True, blank=False)
    zip_code = models.CharField(max_length=20, null=True, blank=False)
    address = models.CharField(max_length=255, null=True, blank=False)
    activation_code = models.UUIDField(default=uuid.uuid4, null=True, blank=True, editable=False)
    
    def __str__(self):
        return self.username
    

class Authentication(models.Model):
    password_attempt = models.IntegerField(default=0)
    otp_code = models.CharField(max_length=6, null=True, blank=True)
    code_attempt = models.IntegerField(default=0)
    expires_at = models.DateTimeField(null=True, blank=True)
    blocked_until = models.DateTimeField(null=True, blank=True)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='authentication')