from urllib import request

from django.shortcuts import render
from rest_framework.generics import ListAPIView, ListCreateAPIView
from .models import Discipline, Event, Country
from .serializers import DisciplineSerializer, EventDetailsSerializer, SearchEventSerializer
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.filters import SearchFilter
from django.db.models import Q

class DisciplineView (ListAPIView) :
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer
    pagination_class = None

class SearchEeventByDisciplineView (ListAPIView) :
    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = Event.objects.all()
    serializer_class = SearchEventSerializer
    
    def get_queryset(self):
        queryset = Event.objects.all()
        discipline = self.request.query_params.get("discipline")
        country = self.request.query_params.get("country")
        date = self.request.query_params.get("date")
        city = self.request.query_params.get("city")
        
        if discipline:
            queryset = queryset.filter(discipline__name__iexact=discipline.strip())
        
        if city :
            queryset = queryset.filter(venue__city__iexact=city.strip())
        
        if date :
            queryset = queryset.filter(date__date=date)
        
        if country :
            queryset = queryset.filter(
                Q(teams__country__name__iexact=country)
                | Q(players__country__name__iexact=country)
            ).distinct()
        
        return queryset
    
    def get_filters(self):
        events = self.get_queryset()
        team_countries = Country.objects.filter(
            teams__events__in=events
        ).distinct()
        
        if team_countries.exists():
            countries = team_countries
        else:
            countries = Country.objects.filter(
                players__events__in=events
            ).distinct()
            
        return {
            "countries": list(
                countries.values_list("name", flat=True).distinct().order_by("name")
            ),
            "disciplines": list(
                events.values_list("discipline__name", flat=True).distinct().order_by("discipline__name")
            ),
            "cities": list(
                events.values_list("venue__city", flat=True).distinct().order_by("venue__city")
            ),
            "dates": list(
                events.values_list("date__date", flat=True).distinct().order_by("date__date")
            ),
        }
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        response.data["filters"] = self.get_filters()
        return response

class ListEventDetailsView (ListAPIView) :
    authentication_classes = []
    serializer_class = EventDetailsSerializer
    permission_classes = [AllowAny]
    queryset = Event.objects.all()
    pagination_class = None
    
    def get_queryset(self):
        return Event.objects.filter(id=self.kwargs["id"])