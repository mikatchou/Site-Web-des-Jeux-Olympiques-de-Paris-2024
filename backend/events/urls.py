from django.urls import path
from .views import *

urlpatterns = [
    path("disciplines/", DisciplineView.as_view(), name="disciplines")
]
