from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = "Apply PostgreSQL row-level security policies for tenant isolation."

    def handle(self, *args, **options):
        if connection.vendor != "postgresql":
            self.stdout.write(self.style.WARNING("Skipping RLS policy application because the database is not PostgreSQL."))
            return

        policies_file = Path(__file__).resolve().parents[3] / "db_policies.sql"
        if not policies_file.exists():
            self.stderr.write(self.style.ERROR(f"RLS policy file not found: {policies_file}"))
            return

        sql = policies_file.read_text()
        statements = [stmt.strip() for stmt in sql.split(";") if stmt.strip()]

        with connection.cursor() as cursor:
            for statement in statements:
                cursor.execute(statement)

        self.stdout.write(self.style.SUCCESS("Applied PostgreSQL RLS policies successfully."))
