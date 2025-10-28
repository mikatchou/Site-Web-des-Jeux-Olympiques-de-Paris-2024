import pytest
from rest_framework.test import APIClient
from authentication.models import *
from django.utils import timezone
from datetime import timedelta
from django.urls import reverse
from rest_framework import status
from django.core import mail
import uuid

@pytest.fixture
def api_client() :
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
def test_authentication_inexistant(api_client, create_auth):
    url = reverse("login_step_2_new_code")
    auth = create_auth
    data = {
        "auth_id" : auth.pk + 1
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data['error'] == "Aucune tentative de connexion n'a été trouvée, veuillez réesayer de vous connecter"
    
@pytest.mark.django_db
def test_code_déjà_envoyé(api_client, create_auth):
    auth = create_auth
    auth.otp_code = "123456"
    auth.expires_at = timezone.now() + timedelta(minutes=5)
    auth.save()
    url = reverse('login_step_2_new_code')
    data = {
        "auth_id" : auth.pk
    }
    response = api_client.post(url, data, format="json")
    left = int((auth.expires_at - timezone.now()).total_seconds())
    minutes = left // 60
    secondes = left % 60
    remaining_time = f"{minutes} minutes {secondes} secondes"
    assert remaining_time == response.data["remaining_time"]
    assert response.status_code == 200
    assert response.data["success"] == f"un code à été déjà envoyé dans votre adresse mail, veuillez attendre encore {remaining_time}"
    
@pytest.mark.django_db
def test_envoi_nouveau_code(api_client, create_auth):
    auth = create_auth
    auth.expires_at = None
    auth.otp_code = None
    auth.save()
    url = reverse('login_step_2_new_code')
    data = {
        "auth_id" : auth.pk
    }
    response = api_client.post(url, data, format="json")
    auth.refresh_from_db()
    assert response.status_code == 200
    assert "success" in response.data
    assert response.data["success"] == "un code à été envoyé dans votre adresse mail"
    assert len(mail.outbox) == 1
    mail_envoyé = mail.outbox[0]
    assert "Connexion en 2 étapes" in mail_envoyé.subject
    assert "mika@test.com" in mail_envoyé.to
    assert str(auth.otp_code) in mail_envoyé.body