from .serializers import *
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
from rest_framework_simplejwt.tokens import RefreshToken
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
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]
        
        #Vérification si l'e-mail existe dans la bdd, sinon retourne une erreur
        user  = CustomUser.objects.filter(email=email).first()
        if not user :
            return Response({"error": "Identifiants incorrects"}, status=401)
        
        #Obtention ou création d'un objet auth
        auth, _ = Authentication.objects.get_or_create(
            user=user
        )
        
        #Vérification si le compte est bloqué temporairement, si oui, retourner forbidden
        if auth.blocked_until and auth.blocked_until > timezone.now():
            return Response({"error": "Trop de tentatives, veuillez réessayer ultérieurement"}, status=403)
        
        #Vérification du mot de passe et incrémentation de l'essai si incorrect, bloque et retourne forbidden si plus de 10 essais
        if not user.check_password(password):
            auth.password_attempt += 1
            if auth.password_attempt >= 10:
                auth.blocked_until = timezone.now() + timedelta(minutes=30)
                auth.password_attempt = 0
                auth.save()
                return Response({"error": "Trop de tentatives, veuillez réessayer ultérieurement"}, status=403)
            auth.save()
            return Response({"error": "Identifiants incorrects"}, status=401)
        
        #Si compte innactive renvoi un mail de confirmation et retourne une erreur
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
        
        #si authentication possède déjà un code encore valide (l'utilisateur tente de se connecter plusiers fois), pas de génération de code ou d'envoi de mail
        if auth.otp_code and auth.expires_at > timezone.now(): 
            auth_id = auth.pk
            return Response({"success": "un code à été déjà envoyé dans votre adresse mail", "auth_id": auth_id}, status=200)
        
        #Génération d'un code pour la connexion en 2 facteurs et envoi du code par e-mail
        otp_code = "".join(random.choices("0123456789", k=6))
        auth.password_attempt = 0
        auth.blocked_until = None
        auth.otp_code = otp_code
        auth.expires_at = timezone.now() + timedelta(minutes=5)
        auth.save()
        send_mail(
            subject="Connexion en 2 étapes",
            message=f"Voici votre code pour la validation en 2 étapes  : {otp_code}\nCe code expirera dans 5 minutes.",
            from_email= settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        auth_id = auth.pk
        return Response({"success": "un code à été envoyé dans votre adresse mail", "auth_id": auth_id}, status=200)
    
class LoginStep2View(APIView):
    serializer_class = OtpSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = OtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        auth_id = serializer.validated_data['auth_id']
        otp_code = serializer.validated_data["otp_code"]
        
        #Vérification si l'authentication existe dans la bdd, sinon retourne une erreur
        try :
            auth = Authentication.objects.get(id=auth_id)
        except Authentication.DoesNotExist:
            return Response(
                {"error": "Aucune tentative de connexion n'a été trouvée, veuillez réesayer de vous connecter"},
                status=401
                )
        #Vérification si le compte est bloqué temporairement, si oui, retourne l'erreur forbidden
        if auth.blocked_until and auth.blocked_until > timezone.now():
            return Response({"error": "Trop de tentatives, veuillez réessayer ultérieurement"}, status=403)
        
        #Vérification si le code est bon mais expiré, retourne une erreur
        if auth.otp_code and auth.otp_code == otp_code and auth.expires_at and auth.expires_at < timezone.now():
            return Response({"error": "Le code a expiré, veuillez faire une nouvelle demande de code"}, status=401)
        
        #Vérification du code et incrémentation de l'essai si incorrect, bloque et retourne forbidden si plus de 10 essais
        if auth.otp_code != otp_code:
            auth.code_attempt += 1
            if auth.code_attempt >= 10:
                auth.blocked_until = timezone.now() + timedelta(minutes=30)
                auth.code_attempt = 0
                auth.save() 
                return Response({"error": "Trop de tentatives, veuillez réessayer ultérieurement"}, status=403)
            auth.save()
            return Response({"error": "Code incorrect"}, status=401)
        
        # Récupération de l'utilisateur par l'id et suppression de l'objet authentication après succès de la connexion en 2 étapes
        user = auth.user  
        auth.delete()

        #Création des tokens de connexion stateless et retour d'une reponse success avec les tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            "success": "Connexion validée",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=200)
        
class LoginStep2NewCodeView(APIView):
    permission_classes = [AllowAny]
    serializer_class = NewOtpSerializer
    
    def post(self, request):
        serializer = NewOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        auth_id = serializer.validated_data['auth_id']
        
        #Vérification si l'authentication existe dans la bdd, sinon retourne une erreur
        try :
            auth = Authentication.objects.get(id=auth_id)
        except Authentication.DoesNotExist:
            return Response(
                {"error": "Aucune tentative de connexion n'a été trouvée, veuillez réesayer de vous connecter"},
                status=401
                )
        
        #Vérification si le compte est bloqué temporairement, si oui, retourne l'erreur forbidden
        if auth.blocked_until and auth.blocked_until > timezone.now():
            return Response({"error": "Trop de tentatives, veuillez réessayer ultérieurement"}, status=403)
        
        #si authentication possède déjà un code encore valide, pas de génération de code ou d'envoi de mail
        if auth.otp_code and auth.expires_at > timezone.now(): 
            left = int((auth.expires_at - timezone.now()).total_seconds())
            minutes = left // 60
            secondes = left % 60
            if minutes > 1:
                remaining_time = f"{minutes} minutes {secondes} secondes"
            else : 
                remaining_time = f"{secondes} secondes"
            return Response(
                {"success": f"un code à été déjà envoyé dans votre adresse mail, veuillez attendre encore {remaining_time}", 
                "remaining_time" : remaining_time}, 
                status=200
                )
            
        #Génération d'un code pour la connexion en 2 facteurs et envoi du code par e-mail
        otp_code = "".join(random.choices("0123456789", k=6))
        auth.otp_code = otp_code
        auth.expires_at = timezone.now() + timedelta(minutes=5)
        auth.save()
        user_mail = auth.user.email
        send_mail(
            subject="Connexion en 2 étapes",
            message=f"Voici votre code pour la validation en 2 étapes  : {otp_code}\nCe code expirera dans 5 minutes.",
            from_email= settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_mail],
            fail_silently=False,
        )
        return Response(
            {"success": "un code à été envoyé dans votre adresse mail"},
            status=200
        )