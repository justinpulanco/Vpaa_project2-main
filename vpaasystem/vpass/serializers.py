from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Event, Attendee, Attendance, Survey, SurveyResponse

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

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
    class Meta:
        model = Event
        fields = '__all__'


class AttendeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendee
        fields = '__all__'


class AttendanceSerializer(serializers.ModelSerializer):
    attendee = AttendeeSerializer()

    class Meta:
        model = Attendance
        fields = ['id', 'event', 'attendee', 'timestamp', 'present', 'certificate']
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