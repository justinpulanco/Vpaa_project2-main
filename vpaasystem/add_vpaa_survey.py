#!/usr/bin/env python
"""
Script to add a comprehensive survey to VPAA Event
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vpaasystem.settings')
django.setup()

from vpass.models import Event, Survey
from django.contrib.auth.models import User

# Get the VPAA Event
try:
    event = Event.objects.get(title="VPAA Event")
    print(f"✅ Found event: {event.title} (ID: {event.id})")
except Event.DoesNotExist:
    print("❌ VPAA Event not found!")
    exit(1)

# Get admin user (or create if doesn't exist)
admin_user = User.objects.filter(is_superuser=True).first()
if not admin_user:
    admin_user = User.objects.first()

# Define survey questions
questions = [
    {
        "id": 1,
        "question": "How satisfied were you with the overall event?",
        "type": "multiple_choice",
        "options": [
            "Very Satisfied",
            "Satisfied",
            "Neutral",
            "Dissatisfied",
            "Very Dissatisfied"
        ],
        "required": True
    },
    {
        "id": 2,
        "question": "How relevant was the content presented during the event?",
        "type": "multiple_choice",
        "options": [
            "Extremely Relevant",
            "Mostly Relevant",
            "Neutral",
            "Slightly Relevant",
            "Not Relevant at All"
        ],
        "required": True
    },
    {
        "id": 3,
        "question": "Was the event well-organized?",
        "type": "multiple_choice",
        "options": [
            "Yes",
            "No",
            "Somewhat"
        ],
        "required": True
    },
    {
        "id": 4,
        "question": "How effective were the speakers/presenters in delivering their message?",
        "type": "multiple_choice",
        "options": [
            "Excellent",
            "Good",
            "Fair",
            "Poor"
        ],
        "required": True
    },
    {
        "id": 5,
        "question": "Did you find the event location and/or platform user-friendly?",
        "type": "multiple_choice",
        "options": [
            "Yes",
            "No",
            "Somewhat"
        ],
        "required": True
    },
    {
        "id": 6,
        "question": "Were the event's objectives clear to you?",
        "type": "multiple_choice",
        "options": [
            "Yes, very clear",
            "Somewhat clear",
            "Not clear at all"
        ],
        "required": True
    },
    {
        "id": 7,
        "question": "What did you enjoy most about the event?",
        "type": "multiple_choice",
        "options": [
            "The speakers/presenters",
            "The topics/content covered",
            "Networking opportunities",
            "The venue/facilities",
            "Interactive activities",
            "Overall organization",
            "Everything",
            "Other"
        ],
        "required": True
    },
    {
        "id": 8,
        "question": "What aspect of the event do you think could be improved?",
        "type": "multiple_choice",
        "options": [
            "Time management",
            "Content depth/quality",
            "Speaker presentation skills",
            "Venue/facilities",
            "Communication/information provided",
            "Registration/check-in process",
            "Food/refreshments",
            "Nothing, it was excellent",
            "Other"
        ],
        "required": True
    },
    {
        "id": 9,
        "question": "Would you attend a similar event in the future?",
        "type": "multiple_choice",
        "options": [
            "Definitely",
            "Maybe",
            "No"
        ],
        "required": True
    },
    {
        "id": 10,
        "question": "Do you have any additional feedback or suggestions for future events?",
        "type": "multiple_choice",
        "options": [
            "More interactive sessions/workshops",
            "Longer event duration",
            "Shorter event duration",
            "More diverse speakers",
            "Different topics/themes",
            "Better timing/schedule",
            "Provide materials/handouts",
            "No suggestions, it was great",
            "Other"
        ],
        "required": False
    }
]

# Create or update survey
survey, created = Survey.objects.get_or_create(
    event=event,
    title="VPAA Event Feedback Survey",
    defaults={
        'created_by': admin_user,
        'is_active': True,
        'questions': questions
    }
)

if not created:
    # Update existing survey
    survey.questions = questions
    survey.is_active = True
    survey.save()
    print(f"✅ Updated existing survey: {survey.title}")
else:
    print(f"✅ Created new survey: {survey.title}")

print(f"\n📋 Survey Details:")
print(f"   Event: {event.title}")
print(f"   Total Questions: {len(questions)}")
print(f"   Multiple Choice: {len([q for q in questions if q['type'] == 'multiple_choice'])}")
print(f"   Open-ended: {len([q for q in questions if q['type'] == 'text'])}")
print(f"   Status: {'Active' if survey.is_active else 'Inactive'}")
print(f"\n✅ Survey successfully added to VPAA Event!")
