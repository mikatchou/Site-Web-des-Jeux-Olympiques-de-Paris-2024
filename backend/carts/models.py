from django.db import models
from datetime import timedelta
from django.utils import timezone
from authentication.models import CustomUser
from events.models import Offer


def cart_expiration():
    return timezone.now() + timedelta(minutes=30)

class Cart (models.Model) :
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=cart_expiration)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="cart")

class CartItem (models.Model) :
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE, related_name="cart_items")
    quantity = models.PositiveIntegerField(default=1)