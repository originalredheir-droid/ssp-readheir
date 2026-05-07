import firebase_admin
from firebase_admin import auth, credentials
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend
from django.core.exceptions import ObjectDoesNotExist

# Initialize Firebase Admin SDK
cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_KEY_PATH)
firebase_admin.initialize_app(cred)

User = get_user_model()

class FirebaseAuthenticationBackend(BaseBackend):
    def authenticate(self, request, id_token=None, **kwargs):
        if id_token is None:
            return None

        try:
            # Verify the Firebase ID token
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            email = decoded_token.get('email')

            # Try to get or create the user
            try:
                user = User.objects.get(firebase_uid=uid)
            except ObjectDoesNotExist:
                # Create user if not exists
                user = User.objects.create_user(
                    username=email or uid,
                    email=email,
                    firebase_uid=uid
                )

            return user
        except Exception as e:
            print(f"Firebase authentication failed: {e}")
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None