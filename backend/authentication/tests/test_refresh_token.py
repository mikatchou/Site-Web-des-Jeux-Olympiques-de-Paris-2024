import pytest
from rest_framework.test import APIClient
from authentication.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from datetime import timedelta
from django.urls import reverse
import uuid

@pytest.fixture
def api_client() :
    return APIClient()

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
        is_active=True,
        activation_code=uuid.UUID("12345678-1234-5678-1234-567812345678")
    )
    return user

@pytest.fixture
def expired_refresh(add_user, api_client):
    user = add_user
    refresh = RefreshToken.for_user(user)
    refresh.set_exp(lifetime=timedelta(microseconds=1))
    refresh_token = str(refresh)
    api_client.cookies["refresh_token"] = refresh_token
    return api_client

@pytest.fixture
def valid_refresh(add_user, api_client):
    user = add_user
    refresh = RefreshToken.for_user(user)
    refresh_token = str(refresh)
    api_client.cookies["refresh_token"] = refresh_token
    return api_client


@pytest.mark.django_db
def test_refresh_token_absent(api_client, add_user) :
    url = reverse('refresh_token')
    response = api_client.post(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "No refresh token" in response.data["error"]
    assert "refresh_token" not in api_client.cookies
    
@pytest.mark.django_db
def test_refresh_token_expiré(expired_refresh) :
    api = expired_refresh
    url = reverse('refresh_token')
    response = api.post(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Refresh token expired or invalid, please login again" in response.data["error"]
    assert api.cookies.get("refresh_token").value == ""

@pytest.mark.django_db
def test_utilisateur_inexistant(add_user, valid_refresh) :
    api = valid_refresh
    url = reverse('refresh_token')
    user = add_user
    user.delete()
    user.save()
    response = api.post(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "User not found" in response.data["error"]
    assert api.cookies.get("refresh_token").value == ""

@pytest.mark.django_db
def test_nouveau_access_token(valid_refresh) :
    api = valid_refresh
    url = reverse('refresh_token')
    response = api.post(url)
    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.data