from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, AttendanceViewSet, SurveyViewSet, SurveyResponseViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'attendances', AttendanceViewSet, basename='attendance')
router.register(r'surveys', SurveyViewSet, basename='survey')
router.register(r'survey-responses', SurveyResponseViewSet, basename='surveyresponse')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
]