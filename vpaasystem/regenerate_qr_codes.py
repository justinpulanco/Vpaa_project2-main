#!/usr/bin/env python
"""
Script to regenerate QR codes for all events with the correct local IP address.
This ensures QR codes work when scanned from mobile phones on the same network.
"""
import os
import django
import socket

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vpaasystem.settings')
django.setup()

from vpass.models import Event

def get_local_ip():
    """Get the local IP address of this machine"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except:
        return "localhost"

def main():
    local_ip = get_local_ip()
    print(f"🌐 Your local IP address: {local_ip}")
    print(f"📱 QR codes will point to: http://{local_ip}:3000/event/[ID]/checkin")
    print("\n" + "="*60)
    
    events = Event.objects.all()
    total = events.count()
    
    if total == 0:
        print("❌ No events found in database.")
        return
    
    print(f"📋 Found {total} event(s). Regenerating QR codes...\n")
    
    for i, event in enumerate(events, 1):
        try:
            event.generate_qr_code()
            event.save()
            print(f"✅ [{i}/{total}] {event.title} (ID: {event.id})")
        except Exception as e:
            print(f"❌ [{i}/{total}] Failed for {event.title}: {str(e)}")
    
    print("\n" + "="*60)
    print("🎉 QR code regeneration complete!")
    print("\n📱 To test on your phone:")
    print(f"   1. Make sure your phone is on the same WiFi network")
    print(f"   2. Make sure frontend is running on: http://{local_ip}:3000")
    print(f"   3. Make sure backend is running on: http://{local_ip}:8000")
    print(f"   4. Download a QR code from the admin panel")
    print(f"   5. Scan it with your phone's camera")
    print(f"   6. It should open: http://{local_ip}:3000/event/[ID]/checkin")

if __name__ == '__main__':
    main()
