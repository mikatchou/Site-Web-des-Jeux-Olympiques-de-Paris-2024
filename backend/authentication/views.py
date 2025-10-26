from .serializers import UserSerializer
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.permissions import AllowAny
from rest_framework import generics, status
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from authentication.models import CustomUser

class UserCreateView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        
        activation_link = f"{settings.SITE_URL}/activation/{user.activation_code}"
        
        send_mail(
            subject="Activation de votre compte",
            message=f"Merci de vous être inscrit. Cliquez sur le lien pour activer votre compte : {activation_link}",
            from_email= settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

class UserActivationView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def update(self, request, *args, **kwargs) :
        activation_code = self.kwargs.get('activation_code')
        user = get_object_or_404(CustomUser, activation_code=activation_code)
        
        user.is_active = True
        user.activation_code = None
        user.save()
        
        return Response({"message": "Votre compte a été activé avec succès !"}, status=status.HTTP_200_OK)