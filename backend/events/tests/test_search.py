import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from model_bakery import baker
from events.models import Category, Event, Offer, Player, Team

@pytest.fixture
def event_with_data(db):
    events = []
    
    football = baker.make("events.Discipline", name="Football")
    basketball = baker.make("events.Discipline", name="Basketball")
    
    for discipline in [football] * 2 + [basketball] * 3:
        event = baker.make(Event, discipline=discipline)
        team = baker.make(Team, events=[event])
        baker.make(Player, team=team, events=[event])
        category = baker.make(Category, event=event)
        baker.make(Offer, category=category)
        events.append(event)
        
    return events

@pytest.mark.django_db
def test_get_events_by_discipline(event_with_data):
    api = APIClient()
    url = reverse('search')
    response = api.get(url)
    assert response.status_code == 200
    data = response.json()
    
    assert data["count"] == 5

    event = data["results"][0]
    assert "date" in event
    assert "discipline" in event
    assert "venue" in event
    assert len(event["teams"]) == 1
    assert len(event["players"]) == 1
    assert len(event["categories"]) == 1
    
@pytest.mark.django_db
def test_get_events(event_with_data):
    api = APIClient()
    url = reverse('search')
    response = api.get(url, {"discipline": "Football"})
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["count"] == 2
    
    event = data["results"][0]
    print(event)
    assert "date" in event
    assert "discipline" in event
    assert "venue" in event
    assert len(event["teams"]) == 1
    assert len(event["players"]) == 1
    assert len(event["categories"]) == 1