from datetime import timedelta
from django.utils import timezone
from carts.tests.factories import make_event_with_data, make_user
from carts.models import Cart
from rest_framework.test import APIClient
from django.urls import reverse
import pytest

@pytest.fixture
def user(db):
    return make_user()

@pytest.fixture
def authenticated_client (db, user) :
    client = APIClient()
    client.force_authenticate(user=user)
    return client

@pytest.fixture
def anonym_client () :
    client = APIClient()
    return client

@pytest.fixture
def get_event(db) :
    return make_event_with_data()

def add_offer (client, offer, quantity) :
    return client.post(reverse("new-item"), {"offer_id" : offer, "quantity" : quantity})

def update_offer (client, item_id, quantity) :
    return client.put(
    reverse("item-update-delete", args=[item_id]), {"quantity": quantity})

def delete_offer (client, item_id) :
    return client.delete(
    reverse("item-update-delete", args=[item_id]))

@pytest.fixture
def cart(authenticated_client, get_event, user):
    response = add_offer(authenticated_client, get_event[2].id, 2)
    assert response.status_code == 201
    return Cart.objects.get(user=user)

@pytest.fixture
def expired_cart(cart):
    cart.expires_at = timezone.now() - timedelta(minutes=10)
    cart.save(update_fields=["expires_at"])
    cart.expires_at
    return cart

@pytest.fixture
def get_cart (cart, authenticated_client) :
    return authenticated_client.get(reverse("cart"))