import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from model_bakery import baker
from events.models import Category, Event, Offer, Player, Team

@pytest.fixture
def event_with_data(db):
    
    football = baker.make("events.Discipline", name="Football")
    france = baker.make("events.Country", name="France", code="FRA")
    event = baker.make(Event, discipline=football)
    team = baker.make("events.Team", country=france, events=[event])
    baker.make("events.Player",team=team,country=france,events=[event])
    category = baker.make(Category, event=event)
    baker.make(Offer, category=category)
    
    return event


@pytest.mark.django_db
def test_get_event(event_with_data):
    api = APIClient()
    url = reverse("event-details", args=[event_with_data.id])
    response = api.get(url)
    assert response.status_code == 200
    data = response.json()
    event = data[0]
    assert "id" in event
    assert "date" in event
    assert "discipline" in event
    assert "venue" in event
    assert "teams" in event
    assert "players" in event
    assert event["discipline"]["name"] == "Football"
    
@pytest.mark.django_db
def test_get_event_with_wrong_id_param(event_with_data):
    api = APIClient()
    url = reverse("event-details", args=[20])
    response = api.get(url)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 0
