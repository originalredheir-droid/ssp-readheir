from django.utils.deprecation import MiddlewareMixin
from django.db import connection
from rest_framework.authtoken.models import Token


class TenantMiddleware(MiddlewareMixin):
    def process_request(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        token_key = None
        if auth_header.startswith("Token "):
            token_key = auth_header.split(" ", 1)[1].strip()

        if token_key:
            try:
                token = Token.objects.select_related("user__organization").get(key=token_key)
                request.user = token.user
                request.tenant_organization = token.user.organization
                if token.user.organization_id and connection.vendor == "postgresql":
                    with connection.cursor() as cursor:
                        cursor.execute("SET app.current_org = %s", [str(token.user.organization_id)])
            except Token.DoesNotExist:
                pass
