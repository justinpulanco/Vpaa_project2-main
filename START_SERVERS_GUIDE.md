# How to Start Both Servers 🚀

## Problem: "Failed to fetch" = Backend not running!

---

## Quick Start (2 Terminals):

### Terminal 1: Backend (Django)

```bash
cd vpaasystem
python manage.py runserver 0.0.0.0:8000
```

**Expected Output:**
```
Starting development server at http://0.0.0.0:8000/
Quit the server with CTRL-BREAK.
```

**Keep this terminal open!** ⚠️

---

### Terminal 2: Frontend (React)

```bash
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!
Local: http://localhost:3000
```

**Keep this terminal open too!** ⚠️

---

## Access:

### On Computer:
```
http://localhost:3000
```

### On Phone (same WiFi):
```
http://192.168.1.5:3000
```
(Replace with YOUR computer's IP from `ipconfig`)

---

## Common Issues:

### ❌ "Failed to fetch" when logging in

**Cause**: Backend (port 8000) not running

**Solution**: Start Terminal 1 (Django server)

### ❌ "Cannot GET /"

**Cause**: Frontend (port 3000) not running

**Solution**: Start Terminal 2 (React server)

### ❌ Port already in use

**Solution**: 
```bash
# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID [PID_NUMBER] /F

# Or use different port
python manage.py runserver 8001
```

---

## Check if Servers are Running:

### Backend (Django):
Open browser: `http://localhost:8000/api/events/`

**Should see:** JSON data or empty array `[]`

### Frontend (React):
Open browser: `http://localhost:3000`

**Should see:** Login page

---

## Stop Servers:

**In each terminal:**
- Press `Ctrl+C`

---

## Restart Servers:

**After code changes:**

1. **Backend**: `Ctrl+C` then run again
2. **Frontend**: Usually auto-reloads, but can `Ctrl+C` and restart

---

## For Mobile Access:

### Step 1: Update Backend ALLOWED_HOSTS

**File**: `vpaasystem/vpaasystem/settings.py`

```python
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '192.168.1.5']  # Your IP
```

### Step 2: Update Frontend API URL

**File**: `frontend/.env`

```
REACT_APP_API_URL=http://192.168.1.5:8000
```

### Step 3: Restart Both Servers

```bash
# Terminal 1
cd vpaasystem
python manage.py runserver 0.0.0.0:8000

# Terminal 2
cd frontend
npm start
```

### Step 4: Access from Phone

```
http://192.168.1.5:3000
```

---

## Troubleshooting:

### Backend won't start?

```bash
# Check Python
python --version

# Check dependencies
cd vpaasystem
pip install -r requirements.txt

# Try again
python manage.py runserver
```

### Frontend won't start?

```bash
# Check Node
node --version

# Check dependencies
cd frontend
npm install

# Try again
npm start
```

---

## Summary:

**Always need 2 terminals running:**

1. ✅ **Terminal 1**: Django (port 8000) - Backend API
2. ✅ **Terminal 2**: React (port 3000) - Frontend UI

**Both must be running for the app to work!** 🚀

---

## Quick Test:

1. Start both servers
2. Open `http://localhost:3000`
3. Try login
4. Should work! ✅

If "Failed to fetch" → Backend not running!
