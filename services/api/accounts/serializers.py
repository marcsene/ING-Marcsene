
from django.contrib.auth import authenticate, get_user_model
from django.db import transaction
from rest_framework import serializers

from businesses.models import Business


User = get_user_model()


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

    def validate(self, attrs):
        user = authenticate(
            username=attrs.get("username"),
            password=attrs.get("password"),
        )

        if user is None:
            raise serializers.ValidationError(
                "Usuario o contraseña incorrectos."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "El usuario está desactivado."
            )

        attrs["user"] = user
        return attrs


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=150,
        trim_whitespace=True,
    )
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        trim_whitespace=False,
    )
    business_name = serializers.CharField(
        max_length=150,
        trim_whitespace=True,
    )
    country = serializers.ChoiceField(
        choices=[
            ("CL", "Chile"),
            ("US", "United States"),
            ("FR", "France"),
            ("ES", "España"),
            ("MX", "México"),
            ("CO", "Colombia"),
            ("AR", "Argentina"),
            ("PE", "Perú"),
        ],
        default="CL",
    )
    language = serializers.ChoiceField(
        choices=Business.LANGUAGE_CHOICES,
        default="es",
    )
    currency = serializers.ChoiceField(
        choices=[
            ("CLP", "Peso chileno"),
            ("USD", "Dólar estadounidense"),
            ("EUR", "Euro"),
            ("MXN", "Peso mexicano"),
            ("COP", "Peso colombiano"),
            ("ARS", "Peso argentino"),
            ("PEN", "Sol peruano"),
        ],
        default="CLP",
    )

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                "Este nombre de usuario ya está registrado."
            )
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "Este correo electrónico ya está registrado."
            )
        return value

    def validate_business_name(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "El nombre del negocio es obligatorio."
            )
        return value.strip()

    @transaction.atomic
    def create(self, validated_data):
        business_name = validated_data.pop("business_name")
        country = validated_data.pop("country")
        language = validated_data.pop("language")
        currency = validated_data.pop("currency")
        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            **validated_data,
        )

        business = Business.objects.create(
            name=business_name,
            owner=user,
            country=country,
            language=language,
            currency=currency,
        )

        return {
            "user": user,
            "business": business,
        }
