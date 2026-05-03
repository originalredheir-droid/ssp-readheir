from rest_framework.permissions import BasePermission


class IsTenantUser(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.organization or request.user.is_superuser)
        )

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        org = getattr(obj, "organization", None)
        return bool(org and request.user.organization_id == org.id)
