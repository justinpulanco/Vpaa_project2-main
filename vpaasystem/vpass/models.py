from django.db import models
from django.utils import timezone
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import io
from PIL import Image, ImageDraw, ImageFont
import os


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('ADMIN', 'Administrator'),
        ('PROF', 'Professor'),
        ('STUDENT', 'Student'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='STUDENT')
    email_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.get_role_display()}"
    
    def is_admin(self):
        return self.role == 'ADMIN'
    
    def is_professor(self):
        return self.role == 'PROF'
    
    def is_student(self):
        return self.role == 'STUDENT'

# Signal to create UserProfile when a new User is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

# Signal to save UserProfile when User is saved
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


class Event(models.Model):
    CATEGORY_CHOICES = [
        ('SEMINAR', 'Seminar'),
        ('WORKSHOP', 'Workshop'),
        ('CONFERENCE', 'Conference'),
        ('TRAINING', 'Training'),
        ('MEETING', 'Meeting'),
        ('OTHER', 'Other'),
    ]
    
    RECURRENCE_CHOICES = [
        ('NONE', 'No Recurrence'),
        ('DAILY', 'Daily'),
        ('WEEKLY', 'Weekly'),
        ('MONTHLY', 'Monthly'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start = models.DateTimeField()
    end = models.DateTimeField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_events')
    qr_code = models.ImageField(upload_to='qr_codes/', null=True, blank=True)
    max_capacity = models.IntegerField(default=0, help_text="0 means unlimited")
    certificate_template = models.CharField(max_length=50, default='default', choices=[
        ('default', 'Default Template'),
        ('modern', 'Modern Template'),
        ('classic', 'Classic Template')
    ])
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='OTHER')
    recurrence = models.CharField(max_length=20, choices=RECURRENCE_CHOICES, default='NONE')
    recurrence_end_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        permissions = [
            ('can_create_event', 'Can create event'),
            ('can_edit_event', 'Can edit event'),
            ('can_delete_event', 'Can delete event'),
        ]

    def __str__(self):
        return self.title
    
    @property
    def status(self):
        now = timezone.now()
        if now < self.start:
            return 'upcoming'
        elif now > self.end:
            return 'completed'
        return 'ongoing'
    
    @property
    def attendee_count(self):
        return self.attendances.filter(present=True).count()
    
    def generate_qr_code(self):
        import qrcode
        from io import BytesIO
        from django.core.files import File
        
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(f"Event ID: {self.id} - {self.title}")
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        
        filename = f'qr_event_{self.id}.png'
        self.qr_code.save(filename, File(buffer), save=False)
        buffer.close()


class Attendee(models.Model):
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='attendee_profile')
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    student_id = models.CharField(max_length=20, blank=True, null=True)
    
    def __str__(self):
        return f"{self.full_name} ({self.student_id or 'No ID'})"


class Attendance(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='attendances')
    attendee = models.ForeignKey(Attendee, on_delete=models.CASCADE, related_name='attendances')
    timestamp = models.DateTimeField(default=timezone.now)
    time_out = models.DateTimeField(null=True, blank=True)
    present = models.BooleanField(default=False)
    certificate = models.FileField(upload_to='certificates/', null=True, blank=True)

    class Meta:
        unique_together = ('event', 'attendee')

    def __str__(self):
        return f"{self.attendee} - {self.event} - {'Present' if self.present else 'Absent'}"
        
    def generate_certificate(self):
        from datetime import date
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import inch
        from reportlab.platypus import Paragraph, Frame, Image
        from io import BytesIO
        from django.conf import settings
        import os
        
        if not self.present:
            return False
            
        buffer = BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter
        
        # Add background color
        c.setFillColorRGB(0.95, 0.95, 0.95)
        c.rect(0, 0, width, height, fill=1, stroke=0)
        
        # Add border
        c.setStrokeColorRGB(0.2, 0.4, 0.7)
        c.setLineWidth(10)
        c.rect(20, 20, width-40, height-40, fill=0, stroke=1)
        
        # Add decorative elements
        c.setFillColorRGB(0.9, 0.95, 1.0)
        c.circle(width/2, height/2, 300, fill=1, stroke=0)
        
        # Add title with shadow effect
        c.setFont('Helvetica-Bold', 36)
        c.setFillColorRGB(0.2, 0.4, 0.7)
        c.drawCentredString(width/2 + 2, height-120 + 2, "CERTIFICATE")
        c.setFillColorRGB(0.1, 0.2, 0.5)
        c.drawCentredString(width/2, height-120, "CERTIFICATE")
        
        # Add subtitle
        c.setFont('Helvetica', 14)
        c.setFillColorRGB(0.3, 0.3, 0.3)
        c.drawCentredString(width/2, height-160, "OF ACHIEVEMENT")
        
        # Add decorative line
        c.setStrokeColorRGB(0.2, 0.4, 0.7)
        c.setLineWidth(2)
        c.line(width/2 - 100, height-180, width/2 + 100, height-180)
        
        # Add main content
        c.setFont('Helvetica', 16)
        c.setFillColorRGB(0.1, 0.1, 0.1)
        c.drawCentredString(width/2, height-240, "This is to certify that")
        
        # Add name with highlight
        c.setFont('Helvetica-Bold', 24)
        c.setFillColorRGB(0.1, 0.3, 0.6)
        c.drawCentredString(width/2, height-290, self.attendee.full_name.upper())
        
        # Add event details
        c.setFont('Helvetica', 14)
        c.setFillColorRGB(0.2, 0.2, 0.2)
        c.drawCentredString(width/2, height-340, "has successfully attended the event:")
        c.setFont('Helvetica-Bold', 18)
        c.setFillColorRGB(0.1, 0.3, 0.6)
        c.drawCentredString(width/2, height-380, f'"{self.event.title}"')
        
        # Add date
        c.setFont('Helvetica-Oblique', 12)
        c.setFillColorRGB(0.3, 0.3, 0.3)
        c.drawCentredString(width/2, 180, f"Date: {self.event.start.strftime('%B %d, %Y')}")
        
        # Add signature line
        c.setLineWidth(1)
        c.line(width/2 - 100, 120, width/2 + 100, 120)
        c.setFont('Helvetica', 12)
        c.drawCentredString(width/2, 90, "Authorized Signature")
        
        # Add footer
        c.setFont('Helvetica', 8)
        c.setFillColorRGB(0.5, 0.5, 0.5)
        c.drawCentredString(width/2, 40, f"Certificate ID: {self.id}")
        c.drawCentredString(width/2, 25, "This certificate is proof of attendance and completion of the event.")
        
        # Add watermark
        c.saveState()
        c.setFont('Helvetica', 60)
        c.setFillColorRGB(0.9, 0.9, 0.9)
        c.rotate(45)
        c.drawString(300, -200, "VPAA SYSTEM")
        c.restoreState()
        
        c.save()
        
        # Rewind buffer to beginning
        buffer.seek(0)
        
        # Save the PDF to the certificate field
        filename = f"certificate_{self.attendee.id}_{self.event.id}.pdf"
        self.certificate.save(filename, ContentFile(buffer.read()), save=False)
        self.save()
        buffer.close()
        
        return True


class Survey(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='surveys')
    title = models.CharField(max_length=255)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_surveys')
    is_active = models.BooleanField(default=True)
    questions = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        permissions = [
            ('can_create_survey', 'Can create survey'),
            ('can_edit_survey', 'Can edit survey'),
            ('can_view_results', 'Can view survey results'),
        ]

    def __str__(self):
        return f"{self.title} ({self.event})"


class SurveyResponse(models.Model):
    attendance = models.ForeignKey(Attendance, on_delete=models.CASCADE, related_name='survey_responses')
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='responses')
    answers = models.JSONField(default=dict)  # {question_id: answer}
    submitted_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('attendance', 'survey')

    def __str__(self):
        return f"Response by {self.attendance.attendee} for {self.survey}"