from rest_framework import serializers
from .models import Event, Attendee, Attendance, Survey, SurveyResponse


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