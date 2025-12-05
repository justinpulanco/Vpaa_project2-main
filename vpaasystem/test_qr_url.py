#!/usr/bin/env python
"""Quick test to verify QR codes contain the correct URL"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vpaasystem.settings')
django.setup()

from vpass.models import Event
import qrcode
from PIL import Image

def decode_qr(qr_path):
    """Decode QR code to see what URL it contains"""
    try:
        from pyzbar.pyzbar import decode
        img = Image.open(qr_path)
        decoded = decode(img)
        if decoded:
            return decoded[0].data.decode('utf-8')
    except ImportError:
        return "Install pyzbar to decode: pip install pyzbar"
    except Exception as e:
        return f"Error: {str(e)}"
    return "Could not decode"

print("=" * 60)
print("QR Code URL Verification")
print("=" * 60)

events = Event.objects.all()[:3]  # Check first 3 events

for event in events:
    print(f"\n📋 Event: {event.title} (ID: {event.id})")
    if event.qr_code:
        print(f"   QR File: {event.qr_code.name}")
        print(f"   Expected URL: http://192.168.254.125:3000/event/{event.id}/checkin")
        
        # Try to decode if pyzbar is available
        qr_path = event.qr_code.path
        if os.path.exists(qr_path):
            decoded = decode_qr(qr_path)
            print(f"   Actual URL: {decoded}")
            
            if "192.168.254.125" in str(decoded):
                print("   ✅ QR code is correct!")
            else:
                print("   ⚠️ QR code might be old format")
    else:
        print("   ❌ No QR code generated")

print("\n" + "=" * 60)
print("Note: To fully decode QR codes, install: pip install pyzbar")
print("=" * 60)
