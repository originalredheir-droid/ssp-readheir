from django.contrib.auth import get_user_model
from django.db.models.signals import post_migrate
from django.dispatch import receiver


@receiver(post_migrate)
def create_default_superuser(sender, **kwargs):
    if sender.name != "apps.core":
        return

    User = get_user_model()
    if not User.objects.filter(username="abhi").exists():
        User.objects.create_superuser(
            username="abhi",
            email="abhi@example.com",
            password="12345",
        )
