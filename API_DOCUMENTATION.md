# VPAA System API Documentation

## Base URL
```
Development: http://localhost:8000/api/
Production: [Your production URL]/api/
```

## Authentication
All API endpoints require JWT authentication except for login/register.

### Headers
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

## Endpoints

### Authentication
#### POST /auth/login/
Login user and get JWT token
```json
{
  "username": "string",
  "password": "string"
}
```

#### POST /auth/register/
Register new user
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "student|professor|admin"
}
```

### Events
#### GET /events/
Get all events
```json
{
  "events": [
    {
      "id": 1,
      "title": "string",
      "description": "string",
      "date": "2024-01-01",
      "qr_code": "string"
    }
  ]
}
```

#### POST /events/
Create new event (Admin/Professor only)
```json
{
  "title": "string",
  "description": "string",
  "date": "2024-01-01",
  "duration": "integer (minutes)"
}
```

### Attendance
#### POST /attendance/checkin/
Check-in to event using QR code
```json
{
  "qr_code": "string",
  "event_id": "integer"
}
```

#### GET /attendance/history/
Get user's attendance history
```json
{
  "attendance": [
    {
      "event": "string",
      "check_in_time": "2024-01-01T10:00:00Z",
      "status": "present|absent"
    }
  ]
}
```

### Certificates
#### GET /certificates/
Get user's certificates
```json
{
  "certificates": [
    {
      "id": 1,
      "event": "string",
      "issued_date": "2024-01-01",
      "certificate_url": "string"
    }
  ]
}
```

#### POST /certificates/generate/
Generate certificate for event (Admin only)
```json
{
  "event_id": "integer",
  "user_id": "integer"
}
```

## Error Responses
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error