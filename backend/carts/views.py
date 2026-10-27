from django.utils import timezone
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from carts.models import Cart, CartItem
from carts.serializers import CartItemSerializer, CartItemUpdateSerializer, CartSerializer
from rest_framework.response import Response
from django.db import transaction
from rest_framework import status
from rest_framework.exceptions import ValidationError, NotFound
from rest_framework.response import Response
from events.models import Category


class CartItemListCreateView(ListCreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None
    
    def get_queryset(self):
        cart = Cart.objects.filter(self.request.user).first()
        return cart.items.select_related("offer") if cart else CartItem.objects.none()
    
    def list(self, request, *args, **kwargs):
        cart, ErrorMessage = get_active_cart(request.user.pk)
        if cart is None:
            raise NotFound(ErrorMessage)
        return Response(CartSerializer(cart).data)
    
    def create(self, request, *args, **kwargs):
        item_serializer = self.get_serializer(data=request.data)
        item_serializer.is_valid(raise_exception=True)

        offer = item_serializer.validated_data["offer"]
        quantity = item_serializer.validated_data.get("quantity", 1)
        seats_requested = quantity * offer.seat_quantity
        response_status = status.HTTP_201_CREATED
        
        with transaction.atomic():
            
            if seats_requested > 10 :
                raise ValidationError({
                    "quantity": "Une offre dans le panier ne peut pas dépasser 10 places au total."
                })
                
            cart, error_message = get_create_cart(request.user.pk)

            if cart is not None:
                cart = Cart.objects.select_for_update().get(pk=cart.pk)
                existing_item = cart.items.select_for_update().filter(
                    offer_id=offer.pk
                ).first()

                if existing_item is not None:
                    new_quantity = quantity
                    if new_quantity == 0 :
                        delete_item(cart)
                        if not cart.items.exists() : 
                            cart.delete()
                        return Response(status=status.HTTP_204_NO_CONTENT)
                    update_cart_item_quantity(existing_item, new_quantity)
                    response_status = status.HTTP_200_OK
                else:
                    category = Category.objects.select_for_update().get(
                        pk=offer.category_id
                    )

                    if seats_requested > category.available_seats:
                        raise ValidationError({
                            "quantity": (
                                f"Places insuffisantes : {category.available_seats} "
                                "encore disponibles."
                            )
                        })

                    category.available_seats -= seats_requested
                    category.held_seats += seats_requested
                    category.save(
                        update_fields=["available_seats", "held_seats"]
                    )

                    item_serializer.save(cart=cart)

        if cart is None:
            raise NotFound(error_message)

        return Response(
            CartSerializer(cart).data,
            status=response_status,
        )

class CartItemUpdateDeleteView (RetrieveUpdateDestroyAPIView) :
    serializer_class = CartItemUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        cart, ErrorMessage = get_active_cart(self.request.user.pk)
        if cart is None:
            raise NotFound(ErrorMessage)
        return cart.items.all()
    
    def destroy(self, request, *args, **kwargs):
        
        with transaction.atomic() :
            item = self.get_object()
            cart = Cart.objects.select_for_update().get(pk=item.cart_id)
            
            delete_item(item)
            
            if not cart.items.exists() :
                cart.delete()
                
            return Response(status=status.HTTP_204_NO_CONTENT)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        partial = kwargs.pop("partial", False)
        item_serializer = self.get_serializer(instance, data=request.data, partial=partial)
        item_serializer.is_valid(raise_exception=True)
        
        with transaction.atomic() :
            new_quantity = item_serializer.validated_data.get("quantity", instance.quantity)
            
            seats_for_item = new_quantity * instance.offer.seat_quantity
            if seats_for_item > 10 :
                raise ValidationError({
                    "quantity": "Une offre dans le panier ne peut pas dépasser 10 places au total."
                })
            
            if new_quantity == 0 :
                cart = Cart.objects.select_for_update().get(pk=instance.cart_id)
                delete_item(instance)
                if not cart.items.exists() : 
                    cart.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            
            item = update_cart_item_quantity(instance, new_quantity)
            
            return Response(
                self.get_serializer(item).data,
                status=status.HTTP_200_OK,
            )

class CartDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cart, message = get_active_cart(self.request.user.pk)
        if cart is None:
            raise NotFound(message)
        return cart

    def destroy(self, request, *args, **kwargs):
        delete_cart(self.get_object())
        return Response(status=status.HTTP_204_NO_CONTENT)

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
                "encore disponibles."
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