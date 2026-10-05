from django.shortcuts import render
from rest_framework.generics import ListAPIView, ListCreateAPIView
from .models import Discipline, Event
from .serializers import DisciplineSerializer, SearchEventSerializer
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.filters import SearchFilter

class DisciplineView (ListAPIView) :
    permission_classes = [AllowAny]
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer
    pagination_class = None

class SearchEeventByDisciplineView (ListAPIView) :
    permission_classes = [AllowAny]
    queryset = Event.objects.all()
    serializer_class = SearchEventSerializer
    
    def get_queryset(self):
        queryset = Event.objects.all()
        discipline = self.request.query_params.get("discipline")
        
        if discipline:
            queryset = queryset.filter(discipline__name__iexact=discipline.strip())
            
        return queryset