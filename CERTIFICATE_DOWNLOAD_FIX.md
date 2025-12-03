# Certificate Download Fix 📄

## ✅ Fixed Issues:

1. **API URL** - Now uses config (works on mobile too)
2. **Better Error Messages** - Shows what went wrong
3. **Console Logging** - Debug info in browser console
4. **Validation** - Checks if certificate file is valid

---

## How to Test:

### Step 1: Complete Event Flow

1. **User Dashboard** → Select event
2. **Time In** → Fill details and check in
3. **Time Out** → Click "Time Out Now"
4. **Complete Survey** (if available)
5. **Certificate Ready!** → Download button appears

### Step 2: Download Certificate

Click **"📄 Download Certificate"**

**Expected:**
- ✅ PDF file downloads
- ✅ Success message appears

**If Error:**
- Check browser console (F12)
- Check Django terminal for errors

---

## Common Issues & Solutions:

### ❌ "Failed to fetch"

**Cause**: Backend not running or wrong URL

**Solution:**
```bash
# Make sure Django is running
cd vpaasystem
python manage.py runserver
```

### ❌ "Certificate not available"

**Cause**: User not marked as present

**Solution:**
- Make sure you did Time In
- Check attendance.present = True in database

### ❌ "Certificate file is empty"

**Cause**: Certificate generation failed

**Solution:**
- Check Django terminal for errors
- Make sure reportlab is installed:
```bash
pip install reportlab
```

### ❌ CORS Error

**Cause**: Frontend URL not in ALLOWED_ORIGINS

**Solution:**
Update `vpaasystem/vpaasystem/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://192.168.1.5:3000",  # Add your IP
]
```

---

## Debug Steps:

### 1. Check Browser Console (F12)

Look for:
```
Downloading certificate for attendance: 1
Response status: 200
Blob size: 45678
```

### 2. Check Django Terminal

Look for:
```
GET /api/attendances/1/download_certificate/ 200
```

### 3. Test Backend Directly

Open in browser:
```
http://localhost:8000/api/attendances/1/download_certificate/
```

Should download PDF file!

---

## Manual Certificate Generation:

If automatic generation fails, generate manually:

```bash
cd vpaasystem
python manage.py shell
```

```python
from vpass.models import Attendance

# Get attendance
att = Attendance.objects.get(id=1)

# Mark as present
att.present = True
att.save()

# Generate certificate
att.generate_certificate()

print(f"Certificate: {att.certificate}")
print(f"Size: {att.certificate.size if att.certificate else 0}")
```

---

## Check Dependencies:

Make sure these are installed:

```bash
pip install reportlab
pip install Pillow
```

---

## Restart Everything:

```bash
# Backend
cd vpaasystem
python manage.py runserver

# Frontend (new terminal)
cd frontend
npm start
```

---

## Test Flow:

1. ✅ Login
2. ✅ Select event
3. ✅ Time in
4. ✅ Time out
5. ✅ Complete survey
6. ✅ Download certificate

---

**Try again with the fixes!** Check console for detailed error messages. 🔍
