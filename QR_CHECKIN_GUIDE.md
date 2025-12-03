# QR Check-in Quick Guide 📱

## Problem Fixed! ✅

Updated the QRScanner to:
- Better parse QR code format
- Show clearer error messages
- Use the correct API endpoint

---

## How to Use QR Check-in

### Step 1: Check Available Events

Open browser: `http://localhost:8000/api/events/`

You'll see something like:
```json
[
  {
    "id": 1,
    "title": "Python Workshop",
    "start": "2025-12-03T03:25:29Z",
    ...
  },
  {
    "id": 2,
    "title": "Web Development",
    ...
  }
]
```

**Note the `id` number!** ⬅️ This is your Event ID

---

### Step 2: Format QR Code Data

Use this exact format:
```
Event ID: [number] - [event name]
```

**Examples:**
```
Event ID: 1 - Python Workshop
Event ID: 2 - Web Development
Event ID: 3 - Testing1
```

⚠️ **Important**: 
- Must include "Event ID: " (with colon and space)
- The number must match an existing event in the database
- Event name can be anything (not validated)

---

### Step 3: Fill the Form

1. **QR Code Data**: `Event ID: 1 - Python Workshop`
2. **Full Name**: `Adrian Moulic`
3. **Email**: `am231@email.com`
4. **Student ID**: `59833252` (optional)
5. Click **✓ Check In**

---

## Common Errors & Solutions

### ❌ "Invalid QR code"
**Problem**: Wrong format
**Solution**: Make sure you have "Event ID: " at the start

### ❌ "Event not found" / "not valid JSON"
**Problem**: Event ID doesn't exist in database
**Solution**: 
1. Check `http://localhost:8000/api/events/`
2. Use an existing event ID (1, 2, 3, etc.)

### ❌ "Event is full"
**Problem**: Event reached max capacity
**Solution**: Admin needs to increase capacity or create new event

---

## Quick Test (Copy-Paste Ready)

If you have an event with ID 1:
```
Event ID: 1 - Test Event
```

If you have an event with ID 2:
```
Event ID: 2 - Test Event
```

---

## For Admin: How to Get Real QR Code

1. Go to Admin Dashboard
2. Click any event card
3. Click "QR Code" tab in the modal
4. Download or print the QR code
5. The QR code image contains the correct format automatically!

---

**Note**: The QR code format is case-insensitive, so "event id: 1" also works!
