import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from authentication.models import CustomUser, Authentication
from django.utils import timezone
from datetime import timedelta
from django.core import mail
import uuid

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture 
def clear_mailbox() :
    mail.outbox.clear()

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
def test_email_inexistant(api_client, add_user):
    url = reverse('login')
    data = {
        "email" : "mikaa@test.com",
        "password" : "1234562ESih..:"
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "error" in response.data
    assert response.data["error"] == "Identifiants incorrects"

@pytest.mark.django_db
def test_compte_bloqué(api_client, add_user):
    url = reverse('login')
    user = add_user
    auth = Authentication.objects.create(
        user = user,
        blocked_until = timezone.now() + timedelta(minutes=30)
    )
    data = {
        "email" : "mika@test.com",
        "password" : "1234562ESih..:"
    }
    response = api_client.post(url, data, format="json")
    
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.data["error"] == "Trop de tentatives, veuillez réessayer ultérieurement"

@pytest.mark.django_db
def test_erreur_password(api_client, add_user) :
    user = add_user
    url = reverse('login')
    data = {
        "email" : "mika@test.com",
        "password" : "1234562ESih..::"
    }
    response = api_client.post(url, data, format="json")
    auth = Authentication.objects.get(user=user)
    assert response.status_code == 401
    assert response.data["error"] == "Identifiants incorrects"
    assert auth.password_attempt == 1

@pytest.mark.django_db
def test_too_many_attempts(api_client, add_user):
    user = add_user
    url = reverse('login')
    data = {
        "email" : "mika@test.com",
        "password" : "1234562ESih..::"
    }
    response = api_client.post(url, data, format="json")
    auth = Authentication.objects.get(user=user)
    auth.password_attempt = 9
    auth.save()
    response = api_client.post(url, data, format="json")
    auth.refresh_from_db()
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.data["error"] == "Trop de tentatives, veuillez réessayer ultérieurement"
    
@pytest.mark.django_db
def test_connexion_avec_data_valid_mais_compte_innactif(api_client, add_user, clear_mailbox) :
    user = add_user
    user.is_active = False
    user.save()
    url = reverse('login')
    data = {
        "email" : "mika@test.com",
        "password" : "1234562ESih..:"
    }
    response = api_client.post(url, data, format="json")
    auth = Authentication.objects.get(user=user)
    assert len(mail.outbox) == 1
    mail_envoyé = mail.outbox[0]
    assert "Activation de votre compte" in mail_envoyé.subject
    assert "mika@test.com" in mail_envoyé.to
    assert str(user.activation_code) in mail_envoyé.body
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "error" in response.data
    assert response.data["error"] == "Votre compte n'est pas actif, veuillez cliquer sur le lien d'activation qui vous a été envoyé par e-mail"
    
@pytest.mark.django_db
def test_connexion_data_valid_et_compte_actif(api_client, add_user) :
    user = add_user
    user.is_active = True
    user.save()
    url = reverse('login')
    data = {
        "email" : "mika@test.com",
        "password" : "1234562ESih..:"
    }
    response = api_client.post(url, data, format="json")
    auth = Authentication.objects.get(user=user)
    assert response.status_code == status.HTTP_200_OK
    assert "success" in response.data
    assert response.data["auth_id"] == auth.pk
    
@pytest.mark.django_db
def test_connexion_successive(api_client, create_auth):
    auth = create_auth
    auth.otp_code = "123456"
    auth.expires_at = timezone.now() + timedelta(minutes=5)
    auth.save()
    url = reverse('login')
    data = {
        "email" : "mika@test.com",
        "password" : "1234562ESih..:"
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == 200
    assert "success" in response.data
    assert response.data["success"] == "un code à été déjà envoyé dans votre adresse mail"
    