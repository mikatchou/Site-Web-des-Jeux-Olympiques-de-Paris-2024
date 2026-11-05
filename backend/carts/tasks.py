from celery import shared_task
from django.db import transaction
from django.utils import timezone
from .services import delete_cart
from .models import Cart

@shared_task
def check_expired_carts () :
    cart_ids = list(
        Cart.objects
        .filter(expires_at__lte=timezone.now())
        .values_list("pk", flat=True)
    )
    for cart_id in cart_ids :
        with transaction.atomic() :
            cart = Cart.objects.select_for_update().get(pk=cart_id, expires_at__lte=timezone.now())
            if cart is not None :
                delete_cart(cart)
                print("cart with id ", cart_id, " is deleted")