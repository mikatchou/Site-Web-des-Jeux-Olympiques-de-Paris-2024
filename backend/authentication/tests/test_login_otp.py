import pytest
from rest_framework.test import APIClient
from authentication.models import *
from django.utils import timezone
from datetime import timedelta
from django.urls import reverse
from rest_framework import status
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
def create_auth(add_user):
    auth = Authentication.objects.create(
        user = add_user,
        otp_code = 123456
    )
    return auth

@pytest.mark.django_db
def test_formulaire_incomplet(api_client, add_user):
    url = reverse('login_step_2')
    data ={
        "otp_code" : "123456"
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    
@pytest.mark.django_db
def test_authentication_inexistant(api_client, add_user):
    url = reverse('login_step_2')
    data = {
        "otp_code" : "123456",
        "auth_id" : "11"
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data['error'] == "Aucune tentative de connexion n'a été trouvée, veuillez réesayer de vous connecter"
    
@pytest.mark.django_db
def test_compte_bloqué(api_client, create_auth):
    auth = create_auth
    auth.blocked_until = timezone.now() + timedelta(minutes=30)
    auth.save()
    url = reverse ("login_step_2")
    data = {
        "otp_code" : "123456",
        "auth_id" : auth.pk
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.data["error"] == "Trop de tentatives, veuillez réessayer ultérieurement"
    
@pytest.mark.django_db
def test_code_expiré(api_client, create_auth):
    auth = create_auth
    auth.expires_at = timezone.now() - timedelta(seconds=10)
    auth.save()
    url = reverse ("login_step_2")
    data = {
        "otp_code" : "123456",
        "auth_id" : auth.pk
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data["error"] == "Le code a expiré, veuillez faire une nouvelle demande de code"
    
@pytest.mark.django_db
def test_erreur_code(api_client, create_auth):
    auth = create_auth
    url = reverse ("login_step_2")
    data = {
        "otp_code" : "123452",
        "auth_id" : auth.pk
    }
    response = api_client.post(url, data, format="json")
    auth.refresh_from_db()
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data["error"] == "Code incorrect"
    assert auth.code_attempt == 1
    
    response = api_client.post(url, data, format="json")
    auth.refresh_from_db()
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data["error"] == "Code incorrect"
    assert auth.code_attempt == 2
    

@pytest.mark.django_db
def connexion_successive(api_client, create_auth):
    auth = create_auth
    auth.otp_code = "123456"
    url = reverse('login_step_2')
    data = {
        "otp_code" : "123456",
        "auth_id" : auth.pk
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == 200
    assert "success" in response.data
    assert response.data["success"] == "un code à été déjà envoyé dans votre adresse mail"
    

@pytest.mark.django_db
def test_code_valide(api_client, create_auth):
    url = reverse('login_step_2')
    auth = create_auth
    data = {
        "otp_code" : "123456",
        "auth_id" : auth.pk
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == 200
    assert "success" in response.data
    assert response.data["success"] == "Connexion validée"
    
    