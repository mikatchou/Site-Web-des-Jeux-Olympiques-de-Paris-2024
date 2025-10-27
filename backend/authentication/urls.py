from django.urls import path
from .views import UserCreateView, UserActivationView, LoginView

urlpatterns = [
    path('inscription/', UserCreateView.as_view(), name='register'),
    path('activation/<str:activation_code>/', UserActivationView.as_view(), name="activation"),
    path('connexion/', LoginView.as_view(), name="login"),
]
