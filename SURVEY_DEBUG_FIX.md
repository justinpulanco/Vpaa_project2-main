# Survey Not Showing - Debug Fix 🔧

## Problem:
Survey exists in database but not showing to users after Time Out.

## What I Fixed:

### Issue:
`fetchSurveys()` was being called before `selectedEvent` was set, so it returned early without fetching.

### Solution:
```javascript
// BEFORE:
useEffect(() => {
  if (attendance) {
    checkCompletion();
    fetchSurveys();  // selectedEvent might be null!
  }
}, [attendance]);

// AFTER:
useEffect(() => {
  if (attendance && selectedEvent) {  // Check both!
    checkCompletion();
    fetchSurveys();
  }
}, [attendance, selectedEvent]);  // Watch both dependencies
```

---

## How to Test:

### 1. Restart Frontend:
```bash
cd frontend
npm start
```

### 2. Open Browser Console (F12)

### 3. Test Flow:
1. **Select Testing1 event**
2. **Time In** → Fill form, check in
3. **Time Out** → Click "Time Out Now"
4. **Check Console** → Should see:
   ```
   Fetching surveys for event: 10
   Surveys fetched: [{...}]
   ```
5. **Survey Form** → Should appear!

---

## What to Look For:

### ✅ Success (Survey Shows):
```
Console:
- Fetching surveys for event: 10
- Surveys fetched: [{ id: X, title: "Questions Testing1", ... }]

UI:
- Survey form appears
- Questions visible
- Submit button ready
```

### ❌ Problem (Survey Missing):
```
Console:
- No "Fetching surveys" message
- OR: Surveys fetched: []

UI:
- "No survey required" message
- Certificate appears immediately
```

---

## If Still Not Working:

### Check Backend:

**1. Verify Survey Exists:**
```bash
cd vpaasystem
python manage.py shell
```

```python
from vpass.models import Survey, Event

# Get Testing1 event
event = Event.objects.get(title="Testing1")
print(f"Event ID: {event.id}")

# Check surveys
surveys = Survey.objects.filter(event=event, is_active=True)
print(f"Surveys: {surveys.count()}")
for s in surveys:
    print(f"- {s.title}: {len(s.questions)} questions")
```

**2. Test API Endpoint:**
Open browser: `http://localhost:8000/api/surveys/by_event/?event_id=10`

Should return:
```json
[
  {
    "id": 1,
    "title": "Questions Testing1",
    "event": 10,
    "is_active": true,
    "questions": [...]
  }
]
```

---

## Alternative: Manual Survey Fetch

If still not working, add manual refresh button:

```javascript
<button onClick={fetchSurveys}>
  🔄 Refresh Survey
</button>
```

---

## Summary:

**Problem:** Survey fetch timing issue
**Fix:** Check both `attendance` AND `selectedEvent` before fetching
**Test:** Check browser console for "Fetching surveys" message

---

**Try now and check the console!** 🔍
