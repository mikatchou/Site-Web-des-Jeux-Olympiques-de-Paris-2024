from rest_framework import serializers
from .models import CustomUser, Authentication

class UserSerializer(serializers.ModelSerializer):
    
    country = serializers.CharField(required=True, allow_blank=False)
    city = serializers.CharField(required=True, allow_blank=False)
    zip_code = serializers.CharField(required=True, allow_blank=False)
    address = serializers.CharField(required=True, allow_blank=False)
    
    
    class Meta:
        model = CustomUser
        fields = ['email', 'last_name','first_name', 'birth', 'phone', 'country', 'city', 'zip_code', 'address','password']
        extra_kwargs = {
            'last_name': {'required': True},
            'first_name': {'required': True},
            'birth': {'required': True},
            'country': {'required': True},
            'city': {'required': True},
            'zip_code': {'required': True},
            'address': {'required': True},
            'email': {'required': True},
            'password': {'write_only': True}
        }
        
    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Cette adresse e-mail est déjà utilisée.")
        return value
    
    def validate(self, attrs):
        # forcer username = email
        if not attrs.get('username') and attrs.get('email'):
            attrs['username'] = attrs['email']
        return attrs
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            last_name=validated_data['last_name'],
            first_name=validated_data['first_name'],
            email=validated_data['email'],
            username=validated_data.get('username', ''),
            password=validated_data['password'],
            birth=validated_data['birth'],
            country=validated_data['country'],
            city=validated_data['city'],
            zip_code=validated_data['zip_code'],
            address=validated_data['address'],
            phone=validated_data.get('phone', '')
        )
        user.is_active = False  # compte innactive jusqu'à vérification par email
        user.save()
        return user
    
class AuthenticationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Authentication
        fields = '__all__'
        read_only_fields = ['code_attempts', 'expires_at', 'user_id']
        
    def create(self, validated_data):
        auth = Authentication.objects.create(
            otp_code=validated_data['otp_code'],
            user_id=validated_data['user_id']
        )
        auth.save()
        return auth
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
class OtpSerializer(serializers.Serializer):
    auth_id = serializers.IntegerField()
    otp_code= serializers.CharField()
    
    def validate_otp_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Le code OTP doit contenir uniquement des chiffres.")
        if len(value) != 6:
            raise serializers.ValidationError("Le code OTP doit avoir 6 chiffres.")
        return value
    
class NewOtpSerializer(serializers.Serializer):
    auth_id = serializers.IntegerField()