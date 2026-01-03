from .settings import *
import os

# Production settings
DEBUG = False

# Update allowed hosts for Vercel
ALLOWED_HOSTS = [
    '.vercel.app',
    '.now.sh',
    'localhost',
    '127.0.0.1',
    '*'  # Allow all for now
]

# Database for production (SQLite works on Vercel)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Static files for production
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files for production  
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# CORS for production - Allow all origins for now
CORS_ALLOW_ALL_ORIGINS = True

# Disable some security for easier deployment
SECURE_BROWSER_XSS_FILTER = False
SECURE_CONTENT_TYPE_NOSNIFF = False
X_FRAME_OPTIONS = 'SAMEORIGIN'