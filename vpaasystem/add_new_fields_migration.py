#!/usr/bin/env python
"""
Script to create and apply migrations for new fields:
- Event.classification
- Attendance.certificate_reviewed
- Attendance.certificate_approved
- Attendance.certificate_modifications
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vpaasystem.settings')
django.setup()

import subprocess

print("=" * 60)
print("Creating Migrations for New Fields")
print("=" * 60)

print("\n📝 Making migrations...")
result = subprocess.run(['python', 'manage.py', 'makemigrations'], capture_output=True, text=True)
print(result.stdout)
if result.stderr:
    print(result.stderr)

print("\n🔄 Applying migrations...")
result = subprocess.run(['python', 'manage.py', 'migrate'], capture_output=True, text=True)
print(result.stdout)
if result.stderr:
    print(result.stderr)

print("\n" + "=" * 60)
print("✅ Migrations Complete!")
print("=" * 60)

print("\nNew fields added:")
print("  - Event.classification (PUBLIC/STUDENTS/FACULTY/ADMIN/RESTRICTED)")
print("  - Attendance.certificate_reviewed (Boolean)")
print("  - Attendance.certificate_approved (Boolean)")
print("  - Attendance.certificate_modifications (JSON)")
