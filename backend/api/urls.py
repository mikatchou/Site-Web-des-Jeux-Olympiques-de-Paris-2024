from django.urls import path, include

urlpatterns = [
    path('auth/', include('authentication.urls')),
    path('events/', include('events.urls'))
]