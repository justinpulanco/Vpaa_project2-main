@echo off
echo ========================================
echo Restarting Frontend for Mobile Access
echo ========================================
echo.
echo Your local IP: 192.168.254.125
echo Frontend will be at: http://192.168.254.125:3000
echo Backend API: http://192.168.254.125:8000
echo.
echo ========================================
echo.

echo Stopping any running frontend servers...
taskkill /F /IM node.exe /T 2>nul

echo.
echo Starting Frontend Server with mobile configuration...
echo (Configuration is in frontend/.env file)
start "React Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Frontend is starting!
echo ========================================
echo.
echo To test on your phone:
echo 1. Make sure phone is on same WiFi
echo 2. Open browser on phone
echo 3. Go to: http://192.168.254.125:3000/event/14/qr
echo 4. Should load without errors!
echo.
echo Press any key to close this window...
pause >nul
