from django.utils.deprecation import MiddlewareMixin
from django.db import connection
from rest_framework.authtoken.models import Token


class TenantMiddleware(MiddlewareMixin):
    def _set_current_org(self, org_id):
        if connection.vendor != "postgresql":
            return
        with connection.cursor() as cursor:
            if org_id:
                cursor.execute("SET app.current_org = %s", [str(org_id)])
            else:
                cursor.execute("RESET app.current_org")

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
                self._set_current_org(token.user.organization_id)
            except Token.DoesNotExist:
                self._set_current_org(None)
        else:
            self._set_current_org(None)

    def process_response(self, request, response):
        self._set_current_org(None)
        return response
