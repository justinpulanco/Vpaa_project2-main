from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, AttendeeViewSet, AttendanceViewSet, SurveyViewSet, SurveyResponseViewSet, UserProfileViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'attendees', AttendeeViewSet, basename='attendee')
router.register(r'attendances', AttendanceViewSet, basename='attendance')
router.register(r'surveys', SurveyViewSet, basename='survey')
router.register(r'survey-responses', SurveyResponseViewSet, basename='surveyresponse')
router.register(r'profiles', UserProfileViewSet, basename='profile')

from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/verify-email/<str:token>/', views.VerifyEmailView.as_view(), name='verify_email'),
    

]