#!/bin/bash

# Build script for Vercel deployment

# Install Python dependencies
pip install -r requirements.txt

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Django setup
cd vpaasystem
python manage.py collectstatic --noinput --settings=vpaasystem.settings_production
python manage.py migrate --settings=vpaasystem.settings_production