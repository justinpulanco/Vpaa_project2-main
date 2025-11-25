import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vpaasystem.vpaasystem.settings')
django.setup()

from vpaasystem.vpass.models import Event, Attendee, Attendance
from datetime import datetime, timedelta

def test_certificate():
    # Create test event
    event = Event.objects.create(
        title="Test Event",
        start=datetime.now(),
        end=datetime.now() + timedelta(hours=2)
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
        print("✅ Certificate generated successfully!")
        print(f"Certificate saved to: {attendance.certificate.path}")
    else:
        print("❌ Failed to generate certificate")

if __name__ == "__main__":
    test_certificate()
