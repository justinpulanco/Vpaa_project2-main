@echo off
echo ========================================
echo Starting VPAA System for Mobile
echo ========================================
echo.
echo Your IP: 192.168.254.125
echo Backend: http://192.168.254.125:8000
echo Frontend: http://192.168.254.125:3000
echo.
echo ========================================
echo.

echo Step 1: Starting Backend...
start "Django Backend" cmd /k "cd vpaasystem && python manage.py runserver 0.0.0.0:8000"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Step 2: Starting Frontend...
echo (Configuration is in frontend/.env file)
start "React Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Wait for both terminals to show:
echo   Backend: "Starting development server at http://0.0.0.0:8000/"
echo   Frontend: "Compiled successfully!"
echo.
echo Then test on your phone:
echo   1. Connect to same WiFi
echo   2. Open browser
echo   3. Go to: http://192.168.254.125:3000/event/14/qr
echo   4. Should see QR code!
echo.
echo If you see "QR Code not available":
echo   - Check if backend terminal shows it's running
echo   - Test: http://192.168.254.125:8000/admin (should work)
echo   - Test: http://192.168.254.125:8000/media/qr_codes/qr_event_14_meUvqxQ.png
echo.
echo Press any key to close this window...
pause >nul
