from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Organization, Tournament, Match, Player

User = get_user_model()


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ["id", "name", "slug", "created_at"]
        read_only_fields = ["id", "created_at"]


class UserSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "organization"]
        read_only_fields = ["id", "role", "organization"]


class RegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True)
    organization_name = serializers.CharField(max_length=255)
    organization_slug = serializers.SlugField(max_length=80)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default=User.ROLE_ORGANIZER)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")
        return value

    def validate_organization_slug(self, value):
        if Organization.objects.filter(slug=value).exists():
            raise serializers.ValidationError("This tenant slug is already registered.")
        return value

    def create(self, validated_data):
        organization = Organization.objects.create(
            name=validated_data["organization_name"],
            slug=validated_data["organization_slug"],
        )
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            role=validated_data["role"],
            organization=organization,
        )
        return user


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ["id", "name", "description", "status", "starts_at", "created_at"]
        read_only_fields = ["id", "created_at"]


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = [
            "id",
            "tournament",
            "home_team",
            "away_team",
            "home_score",
            "away_score",
            "status",
            "starts_at",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ["id", "name", "position", "verified", "dob", "created_at"]
        read_only_fields = ["id", "created_at"]
