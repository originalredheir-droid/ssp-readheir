from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from .models import Organization, User, Tournament, Match, Player


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "created_at"]
    search_fields = ["name", "slug"]


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    fieldsets = DjangoUserAdmin.fieldsets + (
        ("Tenant details", {"fields": ("organization", "role")}),
    )
    list_display = ["username", "email", "organization", "role", "is_staff", "is_superuser"]
    list_filter = ["role", "organization"]


@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display = ["name", "organization", "status", "starts_at"]
    list_filter = ["status", "organization"]
    search_fields = ["name", "description"]


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ["tournament", "home_team", "away_team", "status", "starts_at"]
    list_filter = ["status", "tournament__organization"]
    search_fields = ["home_team", "away_team"]


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ["name", "organization", "position", "verified"]
    list_filter = ["position", "verified", "organization"]
    search_fields = ["name"]
