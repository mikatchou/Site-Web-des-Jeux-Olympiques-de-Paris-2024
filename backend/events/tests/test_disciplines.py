from django.test import TestCase
import pytest
from rest_framework.test import APIClient
from django.urls import reverse

@pytest.mark.django_db
def test_get_disciplines():
    api = APIClient()
    url = reverse('disciplines')
    response = api.get(url)
    assert response.status_code == 200
    data = response.json()

    assert isinstance(data, list)
    assert len(data) > 0
    
    first = data[0]
    assert "id" in first
    assert "name" in first
    assert "image" in first