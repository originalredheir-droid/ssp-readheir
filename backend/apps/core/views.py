import base64
import hashlib
import hmac
import json
import urllib.error
import urllib.request
import uuid
from datetime import timedelta

from django.conf import settings
from django.db.models import Q
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Organization, Tournament, Match, Player, PaymentRecord
from .serializers import (
    RegistrationSerializer,
    UserSerializer,
    OrganizationSerializer,
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


class FirebaseAuthAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        id_token = request.data.get('id_token')
        if not id_token:
            return Response({'error': 'id_token is required'}, status=status.HTTP_400_BAD_REQUEST)

        from django.contrib.auth import authenticate
        user = authenticate(request, id_token=id_token)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "user": UserSerializer(user).data})
        return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)


class LoginAPIView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data["token"])
        user_data = UserSerializer(token.user).data
        return Response({"token": token.key, "user": user_data})


class CurrentUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response(UserSerializer(request.user).data)


class TenantDataMixin:
    def _get_org(self):
        return self.request.user.organization

    def _base_queryset(self, queryset):
        org = self._get_org()
        if not org:
            return queryset.none()
        return queryset.filter(organization=org)

    def _ensure_active_subscription(self):
        org = self._get_org()
        if not org or org.subscription_status != Organization.SUBSCRIPTION_ACTIVE:
            raise PermissionDenied("Active subscription required to manage tenant content.")


class TournamentViewSet(TenantDataMixin, viewsets.ModelViewSet):
    serializer_class = TournamentSerializer
    permission_classes = [IsAuthenticated, IsTenantUser]
    lookup_field = "id"

    def get_queryset(self):
        queryset = self._base_queryset(Tournament.objects.all())
        params = self.request.query_params
        search = params.get("search")
        status_filter = params.get("status")
        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(description__icontains=search))
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    def perform_create(self, serializer):
        self._ensure_active_subscription()
        serializer.save(organization=self.request.user.organization)

    def perform_update(self, serializer):
        self._ensure_active_subscription()
        serializer.save()

    def perform_destroy(self, instance):
        self._ensure_active_subscription()
        instance.delete()


class MatchViewSet(TenantDataMixin, viewsets.ModelViewSet):
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticated, IsTenantUser]
    lookup_field = "id"

    def get_queryset(self):
        queryset = self._base_queryset(Match.objects.all())
        params = self.request.query_params
        search = params.get("search")
        status_filter = params.get("status")
        tournament_id = params.get("tournament")
        team = params.get("team")

        if search:
            queryset = queryset.filter(
                Q(home_team__icontains=search)
                | Q(away_team__icontains=search)
                | Q(tournament__name__icontains=search)
            )
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if tournament_id:
            queryset = queryset.filter(tournament_id=tournament_id)
        if team:
            queryset = queryset.filter(Q(home_team__icontains=team) | Q(away_team__icontains=team))
        return queryset

    def perform_create(self, serializer):
        self._ensure_active_subscription()
        serializer.save(organization=self.request.user.organization)

    def perform_update(self, serializer):
        self._ensure_active_subscription()
        serializer.save()

    def perform_destroy(self, instance):
        self._ensure_active_subscription()
        instance.delete()


class PlayerViewSet(TenantDataMixin, viewsets.ModelViewSet):
    serializer_class = PlayerSerializer
    permission_classes = [IsAuthenticated, IsTenantUser]
    lookup_field = "id"

    def get_queryset(self):
        queryset = self._base_queryset(Player.objects.all())
        params = self.request.query_params
        search = params.get("search")
        position = params.get("position")
        team = params.get("team")

        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(team_name__icontains=search))
        if position:
            queryset = queryset.filter(position=position)
        if team:
            queryset = queryset.filter(team_name__icontains=team)
        return queryset

    def perform_create(self, serializer):
        self._ensure_active_subscription()
        serializer.save(organization=self.request.user.organization)

    def perform_update(self, serializer):
        self._ensure_active_subscription()
        serializer.save()

    def perform_destroy(self, instance):
        self._ensure_active_subscription()
        instance.delete()


class TeamRosterAPIView(APIView):
    permission_classes = [IsAuthenticated, IsTenantUser]

    def get(self, request, *args, **kwargs):
        org = request.user.organization
        if not org:
            return Response([], status=status.HTTP_200_OK)

        teams = (
            Player.objects.filter(organization=org)
            .exclude(team_name="")
            .values_list("team_name", flat=True)
            .distinct()
        )

        roster = []
        for team in teams:
            roster.append(
                {
                    "team_name": team,
                    "players": PlayerSerializer(
                        Player.objects.filter(organization=org, team_name=team),
                        many=True,
                    ).data,
                }
            )

        return Response(roster)


class BillingStatusAPIView(APIView):
    permission_classes = [IsAuthenticated, IsTenantUser]

    def get(self, request, *args, **kwargs):
        org = request.user.organization
        if not org:
            return Response({}, status=status.HTTP_200_OK)

        last_payment = PaymentRecord.objects.filter(organization=org).order_by("-created_at").first()
        return Response(
            {
                "organization": OrganizationSerializer(org).data,
                "last_payment": {
                    "plan_tier": last_payment.plan_tier,
                    "amount": last_payment.amount,
                    "status": last_payment.status,
                    "razorpay_order_id": last_payment.razorpay_order_id,
                    "razorpay_payment_id": last_payment.razorpay_payment_id,
                    "created_at": last_payment.created_at,
                }
                if last_payment
                else None,
            }
        )


class SubscriptionPlanAPIView(APIView):
    permission_classes = [IsAuthenticated, IsTenantUser]

    def get(self, request, *args, **kwargs):
        plans = [
            {
                "tier": Organization.PLAN_STARTER,
                "name": "Starter",
                "amount": 1000,
                "currency": "INR",
                "description": "Small tenant package for early organizers.",
                "features": ["3 tournaments", "Basic live scoring", "Leaderboard analytics"],
            },
            {
                "tier": Organization.PLAN_PRO,
                "name": "Pro",
                "amount": 5000,
                "currency": "INR",
                "description": "Full organizer package with unlimited tournaments and premium support.",
                "features": ["Unlimited tournaments", "Team roster sync", "Priority support"],
            },
        ]
        return Response(plans)


def create_razorpay_order(amount, currency="INR", receipt=None):
    key_id = getattr(settings, "RAZORPAY_KEY_ID", None)
    key_secret = getattr(settings, "RAZORPAY_KEY_SECRET", None)
    if not key_id or not key_secret:
        raise PermissionDenied("Razorpay API credentials are not configured.")

    if not receipt:
        receipt = str(uuid.uuid4())

    payload = json.dumps(
        {
            "amount": amount,
            "currency": currency,
            "receipt": receipt,
            "payment_capture": 1,
        }
    ).encode("utf-8")
    payload_headers = {
        "Content-Type": "application/json",
        "Authorization": "Basic %s" % base64.b64encode(f"{key_id}:{key_secret}".encode()).decode(),
    }
    request = urllib.request.Request(
        "https://api.razorpay.com/v1/orders",
        data=payload,
        headers=payload_headers,
        method="POST",
    )
    try:
        with urllib.request.urlopen(request) as response:
            body = response.read().decode("utf-8")
            return json.loads(body)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8")
        raise PermissionDenied(f"Failed to create Razorpay order: {body}")


def validate_razorpay_signature(payload, signature):
    secret = getattr(settings, "RAZORPAY_WEBHOOK_SECRET", None)
    if not secret or not signature:
        return False

    digest = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(digest, signature)


class CreateOrderAPIView(APIView):
    permission_classes = [IsAuthenticated, IsTenantUser]

    def post(self, request, *args, **kwargs):
        org = request.user.organization
        if not org:
            raise PermissionDenied("Tenant organization not found.")

        plan_tier = request.data.get("plan_tier", Organization.PLAN_STARTER)
        if plan_tier not in {Organization.PLAN_STARTER, Organization.PLAN_PRO}:
            return Response({"detail": "Invalid plan tier."}, status=status.HTTP_400_BAD_REQUEST)

        amount = 1000 if plan_tier == Organization.PLAN_STARTER else 5000
        order = create_razorpay_order(amount, currency="INR")
        payment_record = PaymentRecord.objects.create(
            organization=org,
            plan_tier=plan_tier,
            amount=amount,
            razorpay_order_id=order.get("id", ""),
            status=PaymentRecord.STATUS_CREATED,
        )

        return Response(
            {
                "order": order,
                "razorpay_key_id": getattr(settings, "RAZORPAY_KEY_ID", ""),
                "payment_record_id": str(payment_record.id),
            }
        )


class RazorpayWebhookAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        signature = request.META.get("HTTP_X_RAZORPAY_SIGNATURE", "")
        raw_body = request.body
        if not validate_razorpay_signature(raw_body, signature):
            return Response({"detail": "Invalid webhook signature."}, status=status.HTTP_400_BAD_REQUEST)

        payload = request.data
        event = payload.get("event")
        payment_info = payload.get("payload", {}).get("payment", {}).get("entity", {})
        order_id = payment_info.get("order_id")
        if not order_id:
            return Response({"detail": "Missing order ID in webhook."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payment_record = PaymentRecord.objects.get(razorpay_order_id=order_id)
        except PaymentRecord.DoesNotExist:
            return Response({"detail": "Payment record not found."}, status=status.HTTP_404_NOT_FOUND)

        if event == "payment.captured":
            payment_record.status = PaymentRecord.STATUS_PAID
            payment_record.razorpay_payment_id = payment_info.get("id", "")
            payment_record.save()

            org = payment_record.organization
            org.subscription_status = Organization.SUBSCRIPTION_ACTIVE
            org.plan_tier = payment_record.plan_tier
            org.subscription_next_billing_at = timezone.now() + timedelta(days=30)
            org.save(update_fields=["subscription_status", "plan_tier", "subscription_next_billing_at"])

        elif event in {"payment.failed", "order.failed"}:
            payment_record.status = PaymentRecord.STATUS_FAILED
            payment_record.save()

        return Response({"status": "received"}, status=status.HTTP_200_OK)


class LeaderboardAPIView(APIView):
    permission_classes = [IsAuthenticated, IsTenantUser]

    def get(self, request, *args, **kwargs):
        org = request.user.organization
        if not org:
            return Response([])

        matches = Match.objects.filter(organization=org).exclude(status=Match.STATUS_CANCELLED)
        standings: dict[str, dict[str, int | str]] = {}

        for match in matches:
            if match.home_team not in standings:
                standings[match.home_team] = {
                    "name": match.home_team,
                    "points": 0,
                    "played": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goals_for": 0,
                    "goals_against": 0,
                    "goal_difference": 0,
                }
            if match.away_team not in standings:
                standings[match.away_team] = {
                    "name": match.away_team,
                    "points": 0,
                    "played": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goals_for": 0,
                    "goals_against": 0,
                    "goal_difference": 0,
                }

            home = standings[match.home_team]
            away = standings[match.away_team]

            home["played"] += 1
            away["played"] += 1
            home["goals_for"] += match.home_score
            home["goals_against"] += match.away_score
            away["goals_for"] += match.away_score
            away["goals_against"] += match.home_score
            home["goal_difference"] = home["goals_for"] - home["goals_against"]
            away["goal_difference"] = away["goals_for"] - away["goals_against"]

            if match.home_score > match.away_score:
                home["wins"] += 1
                home["points"] += 3
                away["losses"] += 1
            elif match.away_score > match.home_score:
                away["wins"] += 1
                away["points"] += 3
                home["losses"] += 1
            else:
                home["draws"] += 1
                away["draws"] += 1
                home["points"] += 1
                away["points"] += 1

        sorted_standings = sorted(
            standings.values(),
            key=lambda item: (
                -item["points"],
                -item["goal_difference"],
                -item["goals_for"],
                item["name"],
            ),
        )

        result = []
        for index, entry in enumerate(sorted_standings, start=1):
            result.append({"rank": index, **entry})

        return Response(result)
