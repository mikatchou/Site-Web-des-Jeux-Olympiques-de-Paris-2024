import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from authentication.models import CustomUser
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
        is_active=False,
        activation_code=uuid.UUID("12345678-1234-5678-1234-567812345678")
    )
    return user

@pytest.mark.django_db
def test_token_inexistant(api_client, add_user) :
    url = reverse('activation', args=[str(uuid.uuid4())])
    response = api_client.put(url)
    assert response.status_code == 404

@pytest.mark.django_db
def test_activation(api_client, add_user) :
    url = reverse('activation', args=["12345678-1234-5678-1234-567812345678"])
    response = api_client.put(url)
    assert response.status_code == status.HTTP_200_OK
    