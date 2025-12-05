#!/usr/bin/env python
"""Test event QR code data"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vpaasystem.settings')
django.setup()

from vpass.models import Event
from vpass.serializers import EventSerializer

print("=" * 60)
print("Testing Event QR Code Data")
print("=" * 60)

event = Event.objects.get(id=14)
print(f"\nEvent: {event.title}")
print(f"QR Code field: {event.qr_code}")
print(f"QR Code name: {event.qr_code.name if event.qr_code else 'None'}")
print(f"QR Code URL: {event.qr_code.url if event.qr_code else 'None'}")

print("\n" + "=" * 60)
print("Serialized Data (What API Returns)")
print("=" * 60)

serializer = EventSerializer(event)
data = serializer.data
print(f"\nqr_code field in API: {data.get('qr_code')}")

print("\n" + "=" * 60)
print("Full URL for Frontend")
print("=" * 60)
qr_url = data.get('qr_code')
if qr_url:
    print(f"\nFrontend will try to load:")
    print(f"http://192.168.254.125:8000{qr_url}")
    print(f"\nTest this URL in your browser!")
else:
    print("\n❌ No QR code URL in serialized data!")
