# Test Login Credentials

## Admin Account
- **Email:** admin@test.com
- **Password:** admin123

## How to Test

1. Make sure backend is running:
   ```
   cd vpaasystem
   python manage.py runserver
   ```

2. Make sure frontend is running:
   ```
   cd frontend
   npm start
   ```

3. Go to http://localhost:3000

4. Login with:
   - Email: admin@test.com
   - Password: admin123

## Create New User

You can also sign up with a new account:
1. Click "Sign Up"
2. Enter email and password
3. Account will be created automatically

## Troubleshooting

If login still fails:
1. Check browser console (F12) for errors
2. Check backend terminal for errors
3. Make sure both servers are running
4. Try creating a new user via Sign Up

## Backend API Test

Test the login API directly:
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```

Should return a token and user data.
