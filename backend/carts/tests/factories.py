from carts.models import *
from events.models import *
from model_bakery import baker


def make_event_with_data():
    discipline = baker.make(Discipline, name="Football")
    country = baker.make(Country)
    event = baker.make(Event, discipline=discipline)
    team = baker.make(Team, country=country, events=[event])
    baker.make(Player, team=team, country=country, events=[event])
    category = baker.make(Category, name="A", event=event, total_seats=100, available_seats=100, held_seats=0)
    offer_solo = baker.make(Offer, name="solo", seat_quantity=1, category=category)
    offer_duo = baker.make(Offer, name="duo", seat_quantity=2, category=category)
    return event, offer_solo, offer_duo

def make_user () :
    return baker.make(CustomUser, is_active=True, email="temel.muzemmil@gmail.com")

def make_cart_with_data(expires_at, offer_quantity=3):
    user = make_user()
    _, _, offer_duo = make_event_with_data()
    cart = baker.make(Cart, user=user, expires_at=expires_at)
    
    cart_item = baker.make(CartItem, quantity=offer_quantity, offer=offer_duo, cart=cart)

    category = offer_duo.category
    seats = cart_item.quantity * offer_duo.seat_quantity
    category.available_seats -= seats
    category.held_seats += seats
    category.save(update_fields=["available_seats", "held_seats"])

    return cart, category