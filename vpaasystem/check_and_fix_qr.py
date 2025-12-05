#!/usr/bin/env python
"""
Script to check QR codes and fix any issues
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vpaasystem.settings')
django.setup()

from vpass.models import Event

print("=" * 60)
print("Checking QR Codes")
print("=" * 60)

events = Event.objects.all()
total = events.count()

if total == 0:
    print("❌ No events found in database.")
    exit()

print(f"\n📋 Found {total} event(s)\n")

issues_found = 0
fixed = 0

for i, event in enumerate(events, 1):
    print(f"[{i}/{total}] {event.title} (ID: {event.id})")
    
    if not event.qr_code:
        print(f"   ❌ No QR code field")
        print(f"   🔧 Generating QR code...")
        try:
            event.generate_qr_code()
            event.save()
            print(f"   ✅ QR code generated!")
            fixed += 1
        except Exception as e:
            print(f"   ❌ Failed: {str(e)}")
            issues_found += 1
    else:
        qr_path = event.qr_code.path if hasattr(event.qr_code, 'path') else None
        if qr_path and os.path.exists(qr_path):
            print(f"   ✅ QR code exists: {event.qr_code.name}")
        else:
            print(f"   ⚠️ QR code field exists but file missing")
            print(f"   🔧 Regenerating QR code...")
            try:
                event.generate_qr_code()
                event.save()
                print(f"   ✅ QR code regenerated!")
                fixed += 1
            except Exception as e:
                print(f"   ❌ Failed: {str(e)}")
                issues_found += 1

print("\n" + "=" * 60)
print("Summary")
print("=" * 60)
print(f"Total events: {total}")
print(f"Fixed: {fixed}")
print(f"Issues: {issues_found}")

if issues_found == 0 and fixed == 0:
    print("\n✅ All QR codes are OK!")
elif fixed > 0:
    print(f"\n✅ Fixed {fixed} QR code(s)!")
    print("\n📱 Test on phone:")
    print(f"   http://192.168.254.125:3000/event/{events.first().id}/qr")
else:
    print("\n⚠️ Some issues remain. Check errors above.")
