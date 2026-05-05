import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser


class Organization(models.Model):
    PLAN_STARTER = "starter"
    PLAN_PRO = "pro"

    PLAN_CHOICES = [
        (PLAN_STARTER, "Starter"),
        (PLAN_PRO, "Pro"),
    ]

    SUBSCRIPTION_INACTIVE = "inactive"
    SUBSCRIPTION_ACTIVE = "active"
    SUBSCRIPTION_TRIAL = "trial"

    SUBSCRIPTION_STATUS_CHOICES = [
        (SUBSCRIPTION_INACTIVE, "Inactive"),
        (SUBSCRIPTION_ACTIVE, "Active"),
        (SUBSCRIPTION_TRIAL, "Trial"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=80, unique=True)
    plan_tier = models.CharField(max_length=30, choices=PLAN_CHOICES, default=PLAN_STARTER)
    subscription_status = models.CharField(
        max_length=30,
        choices=SUBSCRIPTION_STATUS_CHOICES,
        default=SUBSCRIPTION_INACTIVE,
    )
    subscription_next_billing_at = models.DateTimeField(null=True, blank=True)
    razorpay_customer_id = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class User(AbstractUser):
    ROLE_SUPER_ADMIN = "super_admin"
    ROLE_ORGANIZER = "organizer"
    ROLE_REFEREE = "referee"
    ROLE_PLAYER = "player"

    ROLE_CHOICES = [
        (ROLE_SUPER_ADMIN, "Super admin"),
        (ROLE_ORGANIZER, "Organizer"),
        (ROLE_REFEREE, "Referee"),
        (ROLE_PLAYER, "Player"),
    ]

    organization = models.ForeignKey(
        Organization,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="users",
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_ORGANIZER)

    def __str__(self):
        return f"{self.username} ({self.organization.slug if self.organization else 'platform'})"


class Tournament(models.Model):
    STATUS_DRAFT = "draft"
    STATUS_SCHEDULED = "scheduled"
    STATUS_LIVE = "live"
    STATUS_COMPLETED = "completed"

    STATUS_CHOICES = [
        (STATUS_DRAFT, "Draft"),
        (STATUS_SCHEDULED, "Scheduled"),
        (STATUS_LIVE, "Live"),
        (STATUS_COMPLETED, "Completed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="tournaments")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    starts_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class Match(models.Model):
    STATUS_SCHEDULED = "scheduled"
    STATUS_LIVE = "live"
    STATUS_COMPLETED = "completed"
    STATUS_CANCELLED = "cancelled"

    STATUS_CHOICES = [
        (STATUS_SCHEDULED, "Scheduled"),
        (STATUS_LIVE, "Live"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="matches")
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="matches")
    home_team = models.CharField(max_length=255)
    away_team = models.CharField(max_length=255)
    home_score = models.PositiveIntegerField(default=0)
    away_score = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_SCHEDULED)
    starts_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["starts_at", "home_team"]

    def __str__(self):
        return f"{self.home_team} vs {self.away_team}"


class Player(models.Model):
    POSITION_CHOICES = [
        ("forward", "Forward"),
        ("midfielder", "Midfielder"),
        ("defender", "Defender"),
        ("goalkeeper", "Goalkeeper"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="players")
    name = models.CharField(max_length=255)
    team_name = models.CharField(max_length=255, blank=True, default="")
    position = models.CharField(max_length=40, choices=POSITION_CHOICES, default="forward")
    verified = models.BooleanField(default=False)
    dob = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class PaymentRecord(models.Model):
    STATUS_CREATED = "created"
    STATUS_PAID = "paid"
    STATUS_FAILED = "failed"

    STATUS_CHOICES = [
        (STATUS_CREATED, "Created"),
        (STATUS_PAID, "Paid"),
        (STATUS_FAILED, "Failed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="payments")
    plan_tier = models.CharField(max_length=30, choices=Organization.PLAN_CHOICES, default=Organization.PLAN_STARTER)
    amount = models.PositiveIntegerField(help_text="Amount in paise")
    razorpay_order_id = models.CharField(max_length=255, unique=True)
    razorpay_payment_id = models.CharField(max_length=255, blank=True, default="")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_CREATED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.organization.slug} {self.plan_tier} {self.status}"
