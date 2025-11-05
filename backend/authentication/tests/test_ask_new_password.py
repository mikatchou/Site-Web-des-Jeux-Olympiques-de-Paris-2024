import pytest
from authentication.models import CustomUser, Authentication
from rest_framework.test import APIClient
from django.utils import timezone
from datetime import timedelta
from django.urls import reverse
from rest_framework import status
from django.core import mail

import uuid

@pytest.fixture
def add_user() :
    user = CustomUser.objects.create_user(
        last_name="temel",
        first_name="Müzemmil",
        username="hello",
        birth="1998-04-02",
        country="france",
        city="besancon",
        zip_code="25960",
        address="28 rue du tatre",
        email="mika@test.com",
        password="1234562ESih..:",
        is_active=False,
        activation_code=uuid.UUID("12345678-1234-5678-1234-567812345678")
    )
    return user

@pytest.fixture
def blocked_user(add_user):
    auth = Authentication.objects.create(
        user=add_user,
        otp_code="123456",
        expires_at=timezone.now() + timedelta(minutes=5),
        blocked_until=timezone.now() + timedelta(hours=1),
    )
    return auth

@pytest.fixture
def api_client() :
    return APIClient()

@pytest.mark.django_db
def test_email_non_fourni (add_user, api_client):
    url = reverse("ask_new_password")
    data = {
        "email" : ""
    }
    response = api_client.post(url, data, format="json") 
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data['email'][0] == "Aucun e-mail n’a été fourni."
    
@pytest.mark.django_db
def test_mauvait_format_email (add_user, api_client):
    url = reverse("ask_new_password")
    data = {
        "email" : "mikast.com"
    }
    response = api_client.post(url, data, format="json") 
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data['email'][0] == "Format d’e-mail invalide."
    

@pytest.mark.django_db
def test_compte_inexistant (add_user, api_client):
    url = reverse("ask_new_password")
    data = {
        "email" : "mikaa@test.com"
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.data['error'] == "Cet email n'est associé à aucun compte existant"

@pytest.mark.django_db
def test_compte_bloqué(blocked_user, api_client):
    url = reverse("ask_new_password")
    data = {
        "email" : "mika@test.com"
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.data['error'] == "Trop de tentatives, veuillez réessayer ultérieurement"

@pytest.mark.django_db
def test_code_envoyé (add_user, api_client):
    url = reverse("ask_new_password")
    data = {
        "email" : "mika@test.com"
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["success"] == "un code à été envoyé dans votre adresse mail"