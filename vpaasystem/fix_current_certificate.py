#!/usr/bin/env python
"""
Quick script to fix the current certificate issue.
Run this with: python fix_current_certificate.py
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vpaasystem.settings')
django.setup()

from vpass.models import Attendance

print("=" * 60)
print("CERTIFICATE FIX SCRIPT")
print("=" * 60)

# Find all attendances with PNG certificates
png_certs = Attendance.objects.filter(certificate__icontains='.png')
print(f"\nFound {png_certs.count()} attendances with PNG certificates")

if png_certs.count() == 0:
    print("\n✓ No PNG certificates found! All certificates are already PDF.")
    print("\nIf you're still having issues:")
    print("1. Make sure the backend server is restarted")
    print("2. Clear your browser cache")
    print("3. Try downloading again")
else:
    print("\nConverting PNG certificates to PDF...\n")
    
    for att in png_certs:
        old_cert = str(att.certificate)
        print(f"Attendance {att.id}: {att.attendee.full_name}")
        print(f"  Old: {old_cert}")
        
        try:
            # Delete old PNG
            att.certificate.delete(save=False)
            
            # Generate new PDF
            if att.generate_certificate():
                print(f"  New: {att.certificate}")
                print(f"  ✓ SUCCESS\n")
            else:
                print(f"  ✗ FAILED to generate\n")
        except Exception as e:
            print(f"  ✗ ERROR: {e}\n")

print("=" * 60)
print("DONE!")
print("=" * 60)
print("\nNext steps:")
print("1. Restart your backend server")
print("2. Clear browser cache")
print("3. Try downloading the certificate again")
print("\nThe certificate should now download as a PDF! 🎉")
