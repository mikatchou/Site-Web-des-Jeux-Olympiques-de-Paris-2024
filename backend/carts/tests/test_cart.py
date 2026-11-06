from django.utils.dateparse import parse_datetime
from django.urls import reverse
from django.utils import timezone
from carts.tests.conftest import add_offer, delete_offer, update_offer
from rest_framework import status


def test_add_offer_while_anonym(get_event, anonym_client) :
    event, offer_solo, offer_duo = get_event
    assert event is not None
    response = add_offer(anonym_client, offer_duo.id, 2)
    assert response.status_code == 401
    assert response.data["detail"] == "Authentication credentials were not provided."

def test_add_offer_while_authenticated(get_event, authenticated_client) :
    event, offer_solo, offer_duo = get_event
    assert event is not None
    response = add_offer(authenticated_client, offer_solo.id, 2)
    assert response.status_code == 201
    assert response.data is not None
    assert response.data["items"][0]["offer"]["name"] == offer_solo.name
    assert response.data["items"][0]["quantity"] == 2
    
    expires_at = parse_datetime(response.data["expires_at"])
    assert expires_at is not None
    assert expires_at > timezone.now()

def test_valid_cart (cart, authenticated_client) :
    response = authenticated_client.get(reverse("cart"))
    assert response.status_code == status.HTTP_200_OK

def test_get_expired_cart (expired_cart, authenticated_client) :
    response = authenticated_client.get(reverse("cart"))
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.data["detail"] == "Votre panier a expiré. Veuillez en créer un nouveau."

def test_add_offer_in_expired_card (expired_cart, authenticated_client, get_event) :
    response = add_offer(authenticated_client, get_event[1].id, 2)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.data["detail"] == "Votre panier a expiré. Veuillez en créer un nouveau."

def test_add_offer_with_quantity_greater_than_ten (authenticated_client, get_event) :
    response = add_offer(authenticated_client, get_event[1].id, 11)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data["quantity"] == "Une offre dans le panier ne peut pas dépasser 10 places au total."

def test_update_offer_quantity (cart, authenticated_client) :
    item_id = cart.items.get().id
    response = update_offer(authenticated_client, item_id,  5)
    assert response.data["items"][0]["quantity"] == 5
    assert response.status_code == status.HTTP_200_OK

def test_update_offer_quantity_greater_than_ten  (cart, authenticated_client) :
    item_id = cart.items.get().id
    response = update_offer(authenticated_client, item_id, 11)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data["quantity"] == "Une offre dans le panier ne peut pas dépasser 10 places au total."

def test_update_offer_quantity_in_expired_cart (expired_cart, authenticated_client) :
    item_id = expired_cart.items.get().id
    response = update_offer(authenticated_client, item_id,  5)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.data["detail"] == "Votre panier a expiré. Veuillez en créer un nouveau."

def test_delete_existing_item_in_cart (cart, authenticated_client) :
    item_id = cart.items.get().id
    response = delete_offer(authenticated_client, item_id)
    assert response.status_code == status.HTTP_204_NO_CONTENT

def test_delete_inexisting_item_in_cart (cart, authenticated_client) :
    item_id = cart.items.get().id + 1
    response = delete_offer(authenticated_client, item_id)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.data["detail"] == "No CartItem matches the given query."

def test_delete_cart (get_cart, authenticated_client) :
    response = get_cart
    assert response.status_code == status.HTTP_200_OK
    assert response.data["items"] is not None
    expires_at = parse_datetime(response.data["expires_at"])
    assert expires_at > timezone.now()
    
    response = authenticated_client.delete(reverse("cart-delete"))
    assert response.status_code == status.HTTP_204_NO_CONTENT
    print(response.data)