from .serializers import UserSerializer, loginSerializer
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from rest_framework.permissions import AllowAny
from rest_framework import generics, status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from authentication.models import CustomUser, Authentication
import random

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
    
class LoginView(APIView) :  
    serializer_class = loginSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = loginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]
        
        user  = CustomUser.objects.filter(email=email).first()
        if not user :
            return Response({"error": "Identifiants incorrects"}, status=401)
        
        auth, _ = Authentication.objects.get_or_create(
            user=user
        )
        if auth.blocked_until and auth.blocked_until > timezone.now():
            return Response({"error": "Trop de tentatives, veuillez réessayer ultérieurement"}, status=403)
        if not user.check_password(password):
            auth.password_attempt += 1
            if auth.password_attempt >= 10:
                auth.blocked_until = timezone.now() + timedelta(minutes=30)
                auth.password_attempt = 0
                return Response({"error": "Trop de tentatives, veuillez réessayer ultérieurement"}, status=403)
            auth.save()
            return Response({"error": "Identifiants incorrects"}, status=401)
        if user.is_active == False :
            activation_link = f"{settings.SITE_URL}/activation/{user.activation_code}"
            send_mail(
                subject="Activation de votre compte",
                message=f"Merci de vous être inscrit. Cliquez sur le lien pour activer votre compte : {activation_link}",
                from_email= settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )   
            return Response({"error": "Votre compte n'est pas actif, veuillez cliquer sur le lien d'activation qui vous a été envoyé par e-mail"}, status=401)
        
        otp_code = "".join(random.choices("0123456789", k=6))
        auth.password_attempt = 0
        auth.blocked_until = None
        auth.otp_code = otp_code
        auth.expires_at = timezone.now() + timedelta(minutes=5)
        auth.save()
        send_mail(
            subject="Activation de votre compte",
            message=f"Voici votre code pour la validation en 2 étapes  : {otp_code}\nCe code expirera dans 5 minutes.",
            from_email= settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        auth_id = auth.pk
        return Response({"success": "un code à été envoyé dans votre adresse mail", "auth_id": auth_id}, status=200)