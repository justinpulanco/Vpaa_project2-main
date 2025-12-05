@echo off
echo ========================================
echo Starting VPAA System for Mobile Access
echo ========================================
echo.
echo Your local IP: 192.168.254.125
echo.
echo Frontend will be at: http://192.168.254.125:3000
echo Backend will be at: http://192.168.254.125:8000
echo.
echo Make sure your phone is on the SAME WiFi network!
echo.
echo ========================================
echo.

echo Starting Backend Server...
start "Django Backend" cmd /k "cd vpaasystem && python manage.py runserver 0.0.0.0:8000"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "React Frontend" cmd /k "cd frontend && set HOST=0.0.0.0 && npm start"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo To test on your phone:
echo 1. Connect phone to same WiFi
echo 2. Go to admin panel and download a QR code
echo 3. Scan the QR code with your phone camera
echo 4. It should open the check-in page!
echo.
echo Press any key to close this window...
pause >nul
