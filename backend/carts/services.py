from django.utils import timezone
from carts.models import Cart, CartItem
from django.db import transaction
from rest_framework.exceptions import ValidationError
from events.models import Category

@transaction.atomic
def get_active_cart(user_id):
    cart = Cart.objects.select_for_update().filter(user_id=user_id).first()
    ErrorMessage = ""

    if cart is None:
        ErrorMessage = "Aucun panier actif."
        return None, ErrorMessage

    if cart.expires_at <= timezone.now():
        delete_cart(cart)
        ErrorMessage = "Votre panier a expiré. Veuillez en créer un nouveau."
        return None, ErrorMessage

    return cart, ErrorMessage

@transaction.atomic
def delete_cart (cart) :
        items = list(cart.items.select_related("offer"))

        seats_by_category = {}
        for item in items:
            category_id = item.offer.category_id
            seats_by_category[category_id] = (
                seats_by_category.get(category_id, 0)
                + item.quantity * item.offer.seat_quantity
            )

        for category_id in sorted(seats_by_category):
            category = Category.objects.select_for_update().get(pk=category_id)
            seats = seats_by_category[category_id]
            category.held_seats -= seats
            category.available_seats += seats
            category.save(update_fields=["held_seats", "available_seats"])

        cart.delete()
        return None

@transaction.atomic
def get_create_cart(user_id):
    cart, created = Cart.objects.get_or_create(user_id=user_id)

    if not created and cart.expires_at <= timezone.now():
        delete_cart(cart)
        return None, "Votre panier a expiré. Veuillez en créer un nouveau."

    return cart, ""

@transaction.atomic
def update_cart_item_quantity(item, new_quantity):
    item = CartItem.objects.select_for_update().get(pk=item.pk)
    category = Category.objects.select_for_update().get(
        pk=item.offer.category_id
    )

    seats_difference = (
        new_quantity - item.quantity
    ) * item.offer.seat_quantity

    if seats_difference > category.available_seats:
        raise ValidationError({
            "quantity": (
                f"Places insuffisantes : {category.available_seats} "
                "places disponibles."
            )
        })

    category.available_seats -= seats_difference
    category.held_seats += seats_difference
    category.save(update_fields=["available_seats", "held_seats"])
        
    item.quantity = new_quantity
    item.save(update_fields=["quantity"])

    return item

@transaction.atomic
def delete_item(item):
    item = (CartItem.objects.select_for_update().select_related("offer").get(pk=item.pk))
    category = Category.objects.select_for_update().get(
        pk=item.offer.category_id
    )
    seats_to_release = item.quantity * item.offer.seat_quantity
    
    category.available_seats += seats_to_release
    category.held_seats -= seats_to_release
    category.save(update_fields=["available_seats", "held_seats"])

    item.delete()