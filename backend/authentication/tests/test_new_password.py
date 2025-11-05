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
def create_auth(add_user):
    auth = Authentication.objects.create(
        user = add_user,
        otp_code = 123456
    )
    return auth

@pytest.fixture
def blocked_user(create_auth):
    auth = create_auth
    auth.blocked_until=timezone.now() + timedelta(hours=1)
    auth.save()
    return auth


@pytest.fixture
def api_client() :
    return APIClient()

@pytest.mark.django_db
def test_password_non_fourni (create_auth, api_client):
    auth = create_auth
    url = reverse("new_password")
    data = {
        "auth_id" : auth.pk,
        "password" : ""
    }
    response = api_client.put(url, data, format="json") 
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data['password'][0] == "Aucun mot de passe n’a été fourni."
    
@pytest.mark.django_db
def test_mauvait_format_password (create_auth, api_client):
    auth = create_auth
    url = reverse("new_password")
    data = {
        "auth_id" : auth.pk,
        "password" : "mikathgcjvh,h"
    }
    response = api_client.put(url, data, format="json") 
    assert response.data['password'][0] == "Il doit contenir au moins une majuscule."
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    

@pytest.mark.django_db
def test_auth_inexistant (create_auth, api_client):
    auth = create_auth
    url = reverse("new_password")
    data = {
        "auth_id" : auth.pk + 1,
        "password" : "mikaa@test.comAZ22!:;,&é"
    }
    response = api_client.put(url, data, format="json")
    assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.django_db
def test_compte_bloqué(blocked_user, api_client):
    auth = blocked_user
    url = reverse("new_password")
    data = {
        "auth_id" : auth.pk,
        "password" : "mikaa@test.comAZ22!:;,&é"
    }
    response = api_client.put(url, data, format="json")
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.data['error'] == "Trop de tentatives, veuillez réessayer ultérieurement"

@pytest.mark.django_db
def test_code_envoyé (create_auth, api_client):
    auth = create_auth
    url = reverse("new_password")
    data = {
        "auth_id" : auth.pk,
        "password" : "mikaa@test.comAZ22!:;,&é"
    }
    response = api_client.put(url, data, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["success"] == "Votre mot de passe a bien été modifié."