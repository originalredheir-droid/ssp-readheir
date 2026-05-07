from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CreateOrderAPIView,
    CurrentUserAPIView,
    FirebaseAuthAPIView,
    LeaderboardAPIView,
    LoginAPIView,
    RegisterAPIView,
    SubscriptionPlanAPIView,
    BillingStatusAPIView,
    RazorpayWebhookAPIView,
    TeamRosterAPIView,
    TournamentViewSet,
    MatchViewSet,
    PlayerViewSet,
)

router = DefaultRouter()
router.register(r"tournaments", TournamentViewSet, basename="tournament")
router.register(r"matches", MatchViewSet, basename="match")
router.register(r"players", PlayerViewSet, basename="player")

urlpatterns = [
    path("auth/register/", RegisterAPIView.as_view(), name="register"),
    path("auth/login/", LoginAPIView.as_view(), name="login"),
    path("auth/firebase/", FirebaseAuthAPIView.as_view(), name="firebase_auth"),
    path("auth/me/", CurrentUserAPIView.as_view(), name="current_user"),
    path("leaderboard/", LeaderboardAPIView.as_view(), name="leaderboard"),
    path("billing/plans/", SubscriptionPlanAPIView.as_view(), name="billing_plans"),
    path("billing/status/", BillingStatusAPIView.as_view(), name="billing_status"),
    path("billing/create-order/", CreateOrderAPIView.as_view(), name="billing_create_order"),
    path("billing/webhook/", RazorpayWebhookAPIView.as_view(), name="billing_webhook"),
    path("teams/", TeamRosterAPIView.as_view(), name="team_roster"),
    path("", include(router.urls)),
]
