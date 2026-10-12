@echo off
REM Starts MySQL, the Django API and the Angular app, each in its own window.
start "Study Buddy - MySQL" cmd /k "%~dp0start-mysql.cmd"
timeout /t 4 /nobreak >nul
start "Study Buddy - Django API" cmd /k "%~dp0start-backend.cmd"
start "Study Buddy - Angular" cmd /k "%~dp0start-frontend.cmd"
echo.
echo Three windows have opened. The app will open in your browser at http://localhost:4200
echo Close the windows to stop the app.
