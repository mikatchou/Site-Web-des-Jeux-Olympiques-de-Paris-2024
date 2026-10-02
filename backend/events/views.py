from django.shortcuts import render
from rest_framework.generics import ListAPIView
from .models import Discipline
from .serializers import DisciplineSerializer
from rest_framework.permissions import AllowAny

class DisciplineView (ListAPIView) :
    permission_classes = [AllowAny]
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer