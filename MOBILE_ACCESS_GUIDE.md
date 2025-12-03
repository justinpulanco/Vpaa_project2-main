# Mobile Access Guide 📱

## Problem: Login fails on phone

**Reason**: `localhost:8000` only works on your computer, not on other devices!

---

## Solution: Use Your Computer's IP Address

### Step 1: Get Your Computer's IP Address

**On Windows:**
```bash
ipconfig
```

Look for: **IPv4 Address**
Example: `192.168.1.5` or `192.168.0.105`

**On Mac/Linux:**
```bash
ifconfig
```

Look for: **inet** under your WiFi adapter
Example: `192.168.1.5`

---

### Step 2: Make Sure Phone & Computer on Same WiFi

Both devices must be connected to the **same WiFi network**!

---

### Step 3: Update Backend Settings

**File**: `vpaasystem/vpaasystem/settings.py`

Find `ALLOWED_HOSTS` and add your IP:

```python
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '192.168.1.5']  # Add your IP here
```

**Restart Django server:**
```bash
python manage.py runserver 0.0.0.0:8000
```

The `0.0.0.0` makes it accessible from other devices!

---

### Step 4: Update Frontend

**Option A: Use Environment Variable (Recommended)**

Create file: `frontend/.env`
```
REACT_APP_API_URL=http://192.168.1.5:8000
```

**Option B: Direct Change**

Edit `frontend/src/config.js`:
```javascript
const API_BASE_URL = 'http://192.168.1.5:8000';  // Your IP here
```

---

### Step 5: Access from Phone

**On your phone browser:**
```
http://192.168.1.5:3000
```

Replace `192.168.1.5` with YOUR computer's IP!

---

## Quick Test

### On Computer:
1. Get IP: `ipconfig` → Example: `192.168.1.5`
2. Update `settings.py` ALLOWED_HOSTS
3. Restart backend: `python manage.py runserver 0.0.0.0:8000`
4. Create `.env` file with your IP
5. Restart frontend: `npm start`

### On Phone:
1. Connect to same WiFi
2. Open browser
3. Go to: `http://192.168.1.5:3000` (use your IP)
4. Login should work! ✅

---

## Troubleshooting

### ❌ Still can't connect?

**Check Firewall:**
- Windows: Allow port 8000 and 3000
- Settings → Firewall → Allow an app

**Check WiFi:**
- Both on same network?
- Not using VPN?

**Check Backend:**
- Running with `0.0.0.0:8000`?
- ALLOWED_HOSTS updated?

**Check Frontend:**
- .env file created?
- Restarted after changes?

---

## For Production

For real deployment, use:
- Domain name (e.g., `https://vpaa.hcdc.edu.ph`)
- HTTPS (secure connection)
- Proper hosting (not localhost)

---

## Summary

**Before:**
- ❌ `localhost:8000` - Only works on computer

**After:**
- ✅ `http://192.168.1.5:8000` - Works on phone too!

---

**Note**: IP address might change when you reconnect to WiFi. Check `ipconfig` again if it stops working!
