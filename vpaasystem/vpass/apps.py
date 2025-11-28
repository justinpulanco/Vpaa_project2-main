from django.apps import AppConfig


class VpassConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'vpass'
    
    def ready(self):
        # Import signal handlers so they are registered when the app is ready
        try:
            from . import signals  # noqa: F401
        except Exception:
            # If signals import fails, don't crash app startup; log in real app
            pass
