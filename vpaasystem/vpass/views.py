from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import FileResponse
from .models import Event, Attendee, Attendance, Survey, SurveyResponse
from .serializers import EventSerializer, AttendeeSerializer, AttendanceSerializer, SurveySerializer, SurveyResponseSerializer


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.select_related('attendee', 'event').all()
    serializer_class = AttendanceSerializer

    @action(detail=True, methods=['post'])
    def mark_present(self, request, pk=None):
        attendance = self.get_object()
        attendance.present = True
        attendance.save()
        serializer = self.get_serializer(attendance)
        return Response(serializer.data)
        
    @action(detail=True, methods=['post'])
    def generate_certificate(self, request, pk=None):
        attendance = self.get_object()
        if not attendance.present:
            return Response("Attendee is not marked as present", status=status.HTTP_400_BAD_REQUEST)
            
        if attendance.certificate:
            return Response("Certificate already exists", status=status.HTTP_200_OK)
            
        if attendance.generate_certificate():
            return Response("Certificate generated successfully", status=status.HTTP_201_CREATED)
        return Response("Failed to generate certificate", status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=['get'])
    def download_certificate(self, request, pk=None):
        attendance = self.get_object()
        if not attendance.certificate:
            return Response("Certificate not found", status=status.HTTP_404_NOT_FOUND)
            
        response = FileResponse(attendance.certificate)
        filename = f"certificate_{attendance.attendee.full_name.replace(' ', '_')}.pdf"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response


class SurveyViewSet(viewsets.ModelViewSet):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer


class SurveyResponseViewSet(viewsets.ModelViewSet):
    queryset = SurveyResponse.objects.select_related('attendance', 'survey').all()
    serializer_class = SurveyResponseSerializer



from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, AttendanceViewSet, SurveyViewSet, SurveyResponseViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'attendances', AttendanceViewSet)
router.register(r'surveys', SurveyViewSet)
router.register(r'survey-responses', SurveyResponseViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]