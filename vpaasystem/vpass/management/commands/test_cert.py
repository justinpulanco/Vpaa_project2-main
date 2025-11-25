from django.core.management.base import BaseCommand
from django.utils import timezone
from vpass.models import Event, Attendee, Attendance
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'Test certificate generation'

    def handle(self, *args, **options):
        # Create test event
        event = Event.objects.create(
            title="Test Event",
            start=timezone.now(),
            end=timezone.now() + timedelta(hours=2)
        )
        
        # Create test attendee
        attendee = Attendee.objects.create(
            full_name="Juan Dela Cruz",
            email="juan@example.com"
        )
        
        # Create attendance
        attendance = Attendance.objects.create(
            event=event,
            attendee=attendee,
            present=True
        )
        
        # Generate certificate
        if attendance.generate_certificate():
            self.stdout.write(self.style.SUCCESS('✅ Certificate generated successfully!'))
            self.stdout.write(f'Certificate saved to: {attendance.certificate.path}')
        else:
            self.stdout.write(self.style.ERROR('❌ Failed to generate certificate'))
