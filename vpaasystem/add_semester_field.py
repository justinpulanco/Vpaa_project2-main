#!/usr/bin/env python
"""
Script to add semester and academic_year fields to Event model
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vpaasystem.settings')
django.setup()

from django.core.management import call_command

print("Creating migrations for semester field...")
call_command('makemigrations', 'vpass')

print("\nApplying migrations...")
call_command('migrate', 'vpass')

print("\n✅ Semester field added successfully!")
print("\nYou can now set semester for events:")
print("  - 1ST: 1st Semester")
print("  - 2ND: 2nd Semester")
print("  - SUMMER: Summer")
print("  - NONE: Not Applicable")
