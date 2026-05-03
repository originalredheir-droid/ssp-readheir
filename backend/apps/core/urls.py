from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterAPIView, LoginAPIView, TournamentViewSet, MatchViewSet, PlayerViewSet

router = DefaultRouter()
router.register(r"tournaments", TournamentViewSet, basename="tournament")
router.register(r"matches", MatchViewSet, basename="match")
router.register(r"players", PlayerViewSet, basename="player")

urlpatterns = [
    path("auth/register/", RegisterAPIView.as_view(), name="register"),
    path("auth/login/", LoginAPIView.as_view(), name="login"),
    path("auth/me/", CurrentUserAPIView.as_view(), name="current_user"),
    path("", include(router.urls)),
]
