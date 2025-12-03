from rest_framework.views import APIView
from django.contrib.auth import authenticate, get_user_model
from django.utils import timezone
from .serializers import UserSerializer
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import FileResponse
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Event, Attendee, Attendance, Survey, SurveyResponse, UserProfile
from .serializers import EventSerializer, AttendeeSerializer, AttendanceSerializer, SurveySerializer, SurveyResponseSerializer, UserProfileSerializer

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        import uuid
        from django.core.mail import send_mail
        
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Create profile with verification token
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.verification_token = str(uuid.uuid4())
            profile.save()
            
            # Send verification email
            verification_link = f"http://localhost:8000/api/auth/verify-email/{profile.verification_token}/"
            try:
                send_mail(
                    'Verify Your Email - HCDC Event System',
                    f'Click this link to verify your email: {verification_link}',
                    'noreply@hcdc.edu.ph',
                    [user.email],
                    fail_silently=True,
                )
            except:
                pass
            
            # Generate token
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser
                },
                'message': 'Please check your email to verify your account'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, token):
        try:
            profile = UserProfile.objects.get(verification_token=token)
            profile.email_verified = True
            profile.verification_token = None
            profile.save()
            return Response({'detail': 'Email verified successfully!'})
        except UserProfile.DoesNotExist:
            return Response({'detail': 'Invalid verification token'}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({'detail': 'Email and password required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        authenticated_user = authenticate(username=user_obj.username, password=password)
        if authenticated_user:
            refresh = RefreshToken.for_user(authenticated_user)
            
            # Get or create profile
            profile, created = UserProfile.objects.get_or_create(user=authenticated_user)
            
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': authenticated_user.id,
                    'username': authenticated_user.username,
                    'email': authenticated_user.email,
                    'first_name': authenticated_user.first_name,
                    'last_name': authenticated_user.last_name,
                    'is_staff': authenticated_user.is_staff,
                    'is_superuser': authenticated_user.is_superuser,
                    'role': profile.role
                }
            })
        
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-start')
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        event = serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None)
        event.generate_qr_code()
        event.save()
    
    @action(detail=True, methods=['get'])
    def attendees(self, request, pk=None):
        event = self.get_object()
        attendances = Attendance.objects.filter(event=event).select_related('attendee')
        serializer = AttendanceSerializer(attendances, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def export_attendance(self, request, pk=None):
        import csv
        from django.http import HttpResponse
        
        event = self.get_object()
        attendances = Attendance.objects.filter(event=event).select_related('attendee')
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="attendance_{event.title}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Name', 'Email', 'Student ID', 'Time In', 'Time Out', 'Present', 'Certificate'])
        
        for att in attendances:
            writer.writerow([
                att.attendee.full_name,
                att.attendee.email,
                att.attendee.student_id or 'N/A',
                att.timestamp.strftime('%Y-%m-%d %H:%M'),
                att.time_out.strftime('%Y-%m-%d %H:%M') if att.time_out else 'N/A',
                'Yes' if att.present else 'No',
                'Yes' if att.certificate else 'No'
            ])
        
        return response
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_events = Event.objects.count()
        upcoming = Event.objects.filter(start__gt=timezone.now()).count()
        completed = Event.objects.filter(end__lt=timezone.now()).count()
        ongoing = total_events - upcoming - completed
        
        return Response({
            'total_events': total_events,
            'upcoming': upcoming,
            'ongoing': ongoing,
            'completed': completed,
            'total_attendees': Attendee.objects.count(),
            'total_certificates': Attendance.objects.exclude(certificate='').count()
        })
    
    @action(detail=True, methods=['get'])
    def qr_code(self, request, pk=None):
        event = self.get_object()
        if not event.qr_code:
            event.generate_qr_code()
            event.save()
        return Response({'qr_code_url': event.qr_code.url if event.qr_code else None})
    
    @action(detail=False, methods=['post'])
    def qr_checkin(self, request):
        """Check in using QR code data"""
        qr_data = request.data.get('qr_data')
        attendee_data = request.data.get('attendee')
        
        # Parse QR data to get event ID
        try:
            event_id = int(qr_data.split('Event ID: ')[1].split(' -')[0])
            event = Event.objects.get(id=event_id)
        except:
            return Response({'detail': 'Invalid QR code'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Use existing time_in logic
        return AttendanceViewSet().time_in(request._request if hasattr(request, '_request') else request)
    
    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Event analytics dashboard"""
        from django.db.models import Count, Q
        from datetime import datetime, timedelta
        
        now = timezone.now()
        last_30_days = now - timedelta(days=30)
        
        analytics = {
            'events_by_category': list(Event.objects.values('category').annotate(count=Count('id'))),
            'events_by_month': list(Event.objects.filter(start__gte=last_30_days).extra(
                select={'month': 'strftime("%%Y-%%m", start)'}
            ).values('month').annotate(count=Count('id'))),
            'attendance_rate': {
                'total_registered': Attendance.objects.count(),
                'total_present': Attendance.objects.filter(present=True).count(),
                'total_certificates': Attendance.objects.exclude(certificate='').count(),
            },
            'popular_events': list(Event.objects.annotate(
                attendee_count=Count('attendances', filter=Q(attendances__present=True))
            ).order_by('-attendee_count')[:5].values('id', 'title', 'attendee_count')),
        }
        
        return Response(analytics)
    
    @action(detail=False, methods=['get'])
    def filter_by_status(self, request):
        status_filter = request.query_params.get('status', 'all')
        now = timezone.now()
        
        if status_filter == 'upcoming':
            events = Event.objects.filter(start__gt=now)
        elif status_filter == 'ongoing':
            events = Event.objects.filter(start__lte=now, end__gte=now)
        elif status_filter == 'completed':
            events = Event.objects.filter(end__lt=now)
        else:
            events = Event.objects.all()
        
        events = events.order_by('-start')
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)


class AttendeeViewSet(viewsets.ModelViewSet):
    queryset = Attendee.objects.all()
    serializer_class = AttendeeSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        if request.user.is_authenticated:
            try:
                attendee = Attendee.objects.get(user=request.user)
                serializer = self.get_serializer(attendee)
                return Response(serializer.data)
            except Attendee.DoesNotExist:
                return Response({'detail': 'Attendee profile not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'detail': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.select_related('attendee', 'event').all()
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['get'])
    def analytics(self, request):
        event_id = request.query_params.get('event_id')
        if event_id:
            attendances = Attendance.objects.filter(event_id=event_id)
            total = attendances.count()
            present = attendances.filter(present=True).count()
            with_cert = attendances.exclude(certificate='').count()
            
            return Response({
                'total_registered': total,
                'total_present': present,
                'attendance_rate': (present / total * 100) if total > 0 else 0,
                'certificates_issued': with_cert
            })
        return Response({'detail': 'Event ID required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def time_in(self, request):
        event_id = request.data.get('event_id')
        attendee_data = request.data.get('attendee')
        
        if not event_id or not attendee_data:
            return Response({'detail': 'Event ID and attendee data required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({'detail': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check capacity
        if event.max_capacity > 0:
            current_count = Attendance.objects.filter(event=event, present=True).count()
            if current_count >= event.max_capacity:
                return Response({'detail': f'Event is full! Maximum capacity: {event.max_capacity}'}, status=status.HTTP_400_BAD_REQUEST)
        
        attendee, _ = Attendee.objects.get_or_create(
            email=attendee_data['email'],
            defaults={
                'full_name': attendee_data.get('full_name', ''),
                'student_id': attendee_data.get('student_id', ''),
                'user': request.user if request.user.is_authenticated else None
            }
        )
        
        attendance, created = Attendance.objects.get_or_create(
            event=event,
            attendee=attendee,
            defaults={'present': True}
        )
        
        if not created:
            attendance.present = True
            attendance.save()
        
        serializer = self.get_serializer(attendance)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def time_out(self, request, pk=None):
        attendance = self.get_object()
        # Mark time out timestamp
        from django.utils import timezone
        attendance.time_out = timezone.now()
        attendance.save()
        serializer = self.get_serializer(attendance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def check_completion(self, request, pk=None):
        attendance = self.get_object()
        has_survey = SurveyResponse.objects.filter(attendance=attendance).exists()
        
        completed = attendance.present and has_survey
        
        # Auto-generate certificate if all tasks completed
        if completed:
            if not attendance.certificate or attendance.certificate.size < 1000:
                attendance.generate_certificate()
        
        return Response({
            'time_in': attendance.present,
            'time_out': bool(attendance.time_out),
            'survey_completed': has_survey,
            'all_completed': completed and bool(attendance.time_out),
            'certificate_ready': bool(attendance.certificate and attendance.certificate.size > 1000) and bool(attendance.time_out)
        })
        
    @action(detail=True, methods=['post'])
    def generate_certificate(self, request, pk=None):
        attendance = self.get_object()
        if not attendance.present:
            return Response({'detail': 'Attendee must be marked present'}, status=status.HTTP_400_BAD_REQUEST)
            
        if attendance.certificate:
            return Response({'detail': 'Certificate already exists', 'certificate_url': attendance.certificate.url})
            
        if attendance.generate_certificate():
            return Response({'detail': 'Certificate generated successfully', 'certificate_url': attendance.certificate.url})
        return Response({'detail': 'Failed to generate certificate'}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=['get'])
    def download_certificate(self, request, pk=None):
        attendance = self.get_object()
        
        # If no certificate or file is too small (corrupted), regenerate
        if not attendance.certificate or attendance.certificate.size < 1000:
            if attendance.present:
                attendance.generate_certificate()
            else:
                return Response({'detail': 'Certificate not available'}, status=status.HTTP_404_NOT_FOUND)
        
        if not attendance.certificate:
            return Response({'detail': 'Certificate generation failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        response = FileResponse(attendance.certificate)
        filename = f"certificate_{attendance.attendee.full_name.replace(' ', '_')}.pdf"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
    
    @action(detail=True, methods=['post'])
    def email_certificate(self, request, pk=None):
        from django.core.mail import EmailMessage
        
        attendance = self.get_object()
        if not attendance.certificate:
            return Response({'detail': 'Certificate not found'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            email = EmailMessage(
                subject=f'Certificate for {attendance.event.title}',
                body=f'Dear {attendance.attendee.full_name},\n\nCongratulations! Your certificate for {attendance.event.title} is attached.\n\nBest regards,\nHCDC Event System',
                from_email='noreply@hcdc.edu.ph',
                to=[attendance.attendee.email]
            )
            attendance.certificate.open()
            email.attach(f'certificate.pdf', attendance.certificate.read(), 'application/pdf')
            email.send(fail_silently=False)
            return Response({
                'detail': f'Certificate sent to {attendance.attendee.email}! Please check your inbox.',
                'note': 'Note: Email feature is in development mode. Check Django console for email preview.'
            })
        except Exception as e:
            # Email sending failed - this is OK for development
            # In production, you would configure a real email server
            return Response({
                'detail': 'Email feature not configured. Please download the certificate instead.',
                'note': 'To enable email: Configure EMAIL_BACKEND in settings.py'
            }, status=status.HTTP_200_OK)  # Return 200 instead of 500


class SurveyViewSet(viewsets.ModelViewSet):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['get'])
    def by_event(self, request):
        event_id = request.query_params.get('event_id')
        if not event_id:
            return Response({'detail': 'Event ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        surveys = Survey.objects.filter(event_id=event_id, is_active=True)
        serializer = self.get_serializer(surveys, many=True)
        return Response(serializer.data)


class SurveyResponseViewSet(viewsets.ModelViewSet):
    queryset = SurveyResponse.objects.select_related('attendance', 'survey').all()
    serializer_class = SurveyResponseSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        
        # Check if all tasks completed and auto-generate certificate
        if response.status_code == status.HTTP_201_CREATED:
            survey_response = SurveyResponse.objects.get(id=response.data['id'])
            attendance = survey_response.attendance
            
            # Check completion
            if attendance.present and not attendance.certificate:
                attendance.generate_certificate()
        
        return response

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.select_related('user').all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        if request.user.is_authenticated:
            profile = UserProfile.objects.get(user=request.user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        return Response({'detail': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)