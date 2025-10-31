from django.urls import path
from .views import *

urlpatterns = [
    path('inscription/', UserCreateView.as_view(), name='register'),
    path('activation/<str:activation_code>/', UserActivationView.as_view(), name="activation"),
    path('connexion/', LoginView.as_view(), name="login"),
    path('connexion/etape-2/', LoginStep2View.as_view(), name="login_step_2"),
    path('connexion/etape-2/nouveau-code/', LoginStep2NewCodeView.as_view(), name="login_step_2_new_code"),
    path('refresh/', RefreshView.as_view(), name="refresh_token"),
]
