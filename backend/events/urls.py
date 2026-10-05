from django.urls import path
from .views import *

urlpatterns = [
    path("disciplines/", DisciplineView.as_view(), name="disciplines"),
    path("search/", SearchEeventByDisciplineView.as_view(), name="search"),
]
