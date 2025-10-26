import pytest
from rest_framework.test import APIClient
from django.core import mail
from django.urls import reverse
from authentication.models import CustomUser

data = {
    "last_name" : "muzemmil",
    "first_name": "temel",
    "email": "murat.alison@gmail.com",
    "username": "hello",
    "password": "Hello.world.2025",
    "birth": "1998-04-02",
    "country": "france",
    "city": "besancon",
    "zip_code": "25960",
    "address": "28 Rue Du Tatre"
}

url = reverse('register')

@pytest.fixture
def api_client() :
    return APIClient()

@pytest.fixture 
def clear_mailbox() :
    mail.outbox.clear()

@pytest.mark.django_db
def test_inscription(api_client, clear_mailbox) :
    response = api_client.post(url, data, format="json")
    
    assert response.status_code == 201
    
    user = CustomUser.objects.get(email="murat.alison@gmail.com")
    assert user.is_active is False
    assert user.activation_code is not None
    
    assert len(mail.outbox) == 1
    mail_envoyé = mail.outbox[0]
    assert "Activation de votre compte" in mail_envoyé.subject
    assert "murat.alison@gmail.com" in mail_envoyé.to
    assert str(user.activation_code) in mail_envoyé.body
    
    response = api_client.post(url, data, format="json")


@pytest.mark.django_db
def test_email_existant (api_client, clear_mailbox):
    api_client.post(url, data, format="json")
    response = api_client.post(url, data, format="json")
    assert response.status_code == 400
    assert "Cette adresse e-mail est déjà utilisée." in str(response.data)