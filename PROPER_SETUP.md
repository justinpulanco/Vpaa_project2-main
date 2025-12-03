# ✅ PROPER SYSTEM SETUP

## 🎯 How It Should Work:

### 👨‍💼 ADMINS (Staff/Superusers):
**Use Django Admin Panel:**
- **URL:** http://localhost:8000/admin/
- **Username:** justin
- **Password:** Justinjames23311
- **Can do:**
  - ✅ Create/Edit/Delete Events
  - ✅ Manage Users
  - ✅ View Attendees
  - ✅ Manage Surveys
  - ✅ View all data

### 👥 REGULAR USERS (Students):
**Use Frontend App:**
- **URL:** http://localhost:3000/
- **Email:** (their email)
- **Password:** (their password)
- **Can do:**
  - ✅ View Events
  - ✅ Time In/Out
  - ✅ Complete Surveys
  - ✅ Download Certificates

## 🔧 Current Issue:

The token error happens because:
1. You logged in before server restart
2. Old token is invalid

## 🚀 SOLUTION:

### For Admin Work:
**Use Django Admin Panel ONLY:**
1. Go to: http://localhost:8000/admin/
2. Login: justin / Justinjames23311
3. Click "Events" → "Add Event"
4. Fill in details
5. Save

### For Testing User Flow:
1. Create a regular user account (not admin)
2. Login to frontend with that account
3. Test time in/out, surveys, certificates

## 📝 Create Test User:

Run this to create a test student:
```bash
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); u = User.objects.create_user(username='student1', email='student1@test.com', password='student123'); print('Student created!')"
```

Then login to frontend:
- Email: student1@test.com
- Password: student123

## ✅ Proper Workflow:

1. **Admin creates events** → Django Admin Panel
2. **Students register** → Frontend
3. **Students attend** → Frontend (Time in/out)
4. **Students get certificates** → Frontend (Auto-generated)
5. **Admin views reports** → Django Admin Panel

This is the proper way! 🎯
