from rest_framework import viewsets, status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Tournament, Match, Player
from .serializers import (
    RegistrationSerializer,
    UserSerializer,
    TournamentSerializer,
    MatchSerializer,
    PlayerSerializer,
)
from .permissions import IsTenantUser


class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)


class LoginAPIView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data["token"])
        user_data = UserSerializer(token.user).data
        return Response({"token": token.key, "user": user_data})


class TournamentViewSet(viewsets.ModelViewSet):
    serializer_class = TournamentSerializer
    permission_classes = [IsAuthenticated, IsTenantUser]

    def get_queryset(self):
        org = self.request.user.organization
        if not org:
            return Tournament.objects.none()
        return Tournament.objects.filter(organization=org)

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)


class MatchViewSet(viewsets.ModelViewSet):
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticated, IsTenantUser]

    def get_queryset(self):
        org = self.request.user.organization
        if not org:
            return Match.objects.none()
        return Match.objects.filter(organization=org)

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)


class PlayerViewSet(viewsets.ModelViewSet):
    serializer_class = PlayerSerializer
    permission_classes = [IsAuthenticated, IsTenantUser]

    def get_queryset(self):
        org = self.request.user.organization
        if not org:
            return Player.objects.none()
        return Player.objects.filter(organization=org)

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)
