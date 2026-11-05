from rest_framework import serializers
from events.models import Offer
from events.serializers import CartEventSerializer, OfferSerializer
from carts.models import Cart, CartItem


class CartItemSerializer (serializers.ModelSerializer) :
    offer = OfferSerializer(read_only=True)
    offer_id = serializers.PrimaryKeyRelatedField(
        source="offer",
        queryset=Offer.objects.all(),
        write_only=True,
    )
    total_seats = serializers.SerializerMethodField()
    event = CartEventSerializer(
        source="offer.category.event",
        read_only=True,
    )
    category_name = serializers.CharField(
        source="offer.category.name",
        read_only=True,
    )
    available_seats = serializers.IntegerField(
        source="offer.category.available_seats",
        read_only=True
    )

    def get_total_seats(self, item):
        return item.quantity * item.offer.seat_quantity

    class Meta :
        model = CartItem
        fields = ["id", "quantity", "offer", "offer_id", "total_seats", "event", "category_name", "available_seats"]

class CartSerializer (serializers.ModelSerializer) :
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    
    def get_total_price(self, cart):
        return sum(
            item.quantity * item.offer.seat_quantity * item.offer.price
            for item in cart.items.all()
        )
    
    class Meta :
        model = Cart
        fields = "__all__"
        read_only_fields = ("created_at", "expires_at", "user")


class CartItemUpdateSerializer (serializers.ModelSerializer) :
    offer = OfferSerializer(read_only=True)
    offer_id = serializers.PrimaryKeyRelatedField(
        source="offer",
        read_only=True,
    )
    total_seats = serializers.SerializerMethodField()
    read_only_fileds : {"user"}

    def get_total_seats(self, item):
        return item.quantity * item.offer.seat_quantity

    class Meta :
        model = CartItem
        fields = ["id", "quantity", "offer", "offer_id", "total_seats"]
