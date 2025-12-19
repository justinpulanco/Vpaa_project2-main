# Testing Guide

## Frontend Testing (React)

### Running Tests
```bash
cd frontend
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

### Test Structure
- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Full user flow testing

### Example Test Files
- `src/App.test.js` - Main app component tests
- `src/components/__tests__/` - Component-specific tests

## Backend Testing (Django)

### Running Tests
```bash
cd vpaasystem
python manage.py test
```

### Test Coverage
```bash
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

### Test Categories
- **Model Tests**: Database model validation
- **View Tests**: API endpoint testing
- **Authentication Tests**: User login/permissions
- **Integration Tests**: Full workflow testing

### Example Test Structure
```python
# tests/test_models.py
from django.test import TestCase
from django.contrib.auth.models import User
from vpass.models import Event, Attendance

class EventModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
    
    def test_event_creation(self):
        event = Event.objects.create(
            title='Test Event',
            description='Test Description',
            created_by=self.user
        )
        self.assertEqual(event.title, 'Test Event')
        self.assertTrue(event.qr_code)
```

## Manual Testing Checklist

### User Authentication
- [ ] User can register
- [ ] User can login
- [ ] User can logout
- [ ] Password validation works
- [ ] JWT tokens are properly handled

### Event Management
- [ ] Admin can create events
- [ ] Events display correctly
- [ ] QR codes are generated
- [ ] Event details are accurate

### Attendance System
- [ ] QR code scanning works
- [ ] Check-in records properly
- [ ] Attendance history displays
- [ ] Real-time updates work

### Certificate Generation
- [ ] Certificates generate correctly
- [ ] PDF downloads work
- [ ] Certificate data is accurate
- [ ] Only eligible users get certificates

### Mobile Responsiveness
- [ ] App works on mobile devices
- [ ] QR scanner works on mobile
- [ ] UI is mobile-friendly
- [ ] Touch interactions work

## Performance Testing
- Load testing with multiple users
- QR code scanning speed
- Database query optimization
- Frontend rendering performance

## Security Testing
- Authentication bypass attempts
- SQL injection testing
- XSS vulnerability testing
- CSRF protection validation