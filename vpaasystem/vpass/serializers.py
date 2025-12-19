from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.core.validators import EmailValidator, RegexValidator
from django.utils import timezone
from .models import Event, Attendee, Attendance, Survey, SurveyResponse, UserProfile

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'username', 'email', 'role']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        help_text="Password must be at least 8 characters long"
    )
    email = serializers.EmailField(
        validators=[EmailValidator(message="Please enter a valid email address")]
    )
    username = serializers.CharField(
        min_length=3,
        max_length=30,
        validators=[RegexValidator(
            regex=r'^[a-zA-Z0-9_]+$',
            message="Username can only contain letters, numbers, and underscores"
        )]
    )

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class EventSerializer(serializers.ModelSerializer):
    status = serializers.ReadOnlyField()
    attendee_count = serializers.ReadOnlyField()
    title = serializers.CharField(
        max_length=255,
        help_text="Event title (max 255 characters)"
    )
    max_capacity = serializers.IntegerField(
        min_value=0,
        help_text="Maximum number of attendees (0 for unlimited)"
    )
    
    class Meta:
        model = Event
        fields = '__all__'
    
    def validate(self, data):
        # Validate start and end times
        if 'start' in data and 'end' in data:
            if data['end'] <= data['start']:
                raise serializers.ValidationError("End time must be after start time")
            
            # Check if start time is not too far in the past (for new events)
            if not self.instance and data['start'] < timezone.now():
                raise serializers.ValidationError("Event start time cannot be in the past")
        
        # Validate title is not empty
        if 'title' in data and not data['title'].strip():
            raise serializers.ValidationError("Event title cannot be empty")
            
        return data


class AttendeeSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[EmailValidator(message="Please enter a valid email address")]
    )
    full_name = serializers.CharField(
        max_length=255,
        help_text="Full name is required"
    )
    student_id = serializers.CharField(
        max_length=20,
        required=False,
        allow_blank=True,
        validators=[RegexValidator(
            regex=r'^[a-zA-Z0-9-]+$',
            message="Student ID can only contain letters, numbers, and hyphens"
        )]
    )
    
    class Meta:
        model = Attendee
        fields = '__all__'
    
    def validate_full_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Full name cannot be empty")
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Full name must be at least 2 characters long")
        return value.strip()


class AttendanceSerializer(serializers.ModelSerializer):
    attendee = AttendeeSerializer()
    event = EventSerializer(read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'event', 'attendee', 'timestamp', 'time_out', 'present', 'certificate', 
                  'certificate_reviewed', 'certificate_approved', 'certificate_modifications']
        read_only_fields = ['certificate']

    def create(self, validated_data):
        att_data = validated_data.pop('attendee')
        attendee, _ = Attendee.objects.get_or_create(email=att_data['email'], defaults=att_data)
        attendance, _ = Attendance.objects.get_or_create(event=validated_data['event'], attendee=attendee)
        
        for k, v in validated_data.items():
            setattr(attendance, k, v)
        attendance.save()
        return attendance


class SurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = '__all__'


class SurveyResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurveyResponse
        fields = '__all__'