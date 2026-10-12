@echo off
setlocal
title Study Buddy - stop
set "XAMPP=C:\xampp"

echo Stopping Study Buddy...

REM Angular dev server (port 4200) and Django (port 8000)
call :killport 4200 "web app"
call :killport 8000 "API"

REM MySQL: ask it to shut down cleanly, then make sure it is gone
tasklist /FI "IMAGENAME eq mysqld.exe" | find /I "mysqld.exe" >nul
if not errorlevel 1 (
  echo Stopping MySQL...
  "%XAMPP%\mysql\bin\mysqladmin.exe" -u root shutdown >nul 2>&1
  ping -n 4 127.0.0.1 >nul
  tasklist /FI "IMAGENAME eq mysqld.exe" | find /I "mysqld.exe" >nul
  if not errorlevel 1 taskkill /F /IM mysqld.exe >nul 2>&1
)

REM Close the helper windows if any are left
taskkill /F /FI "WINDOWTITLE eq Study Buddy - MySQL*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Study Buddy - API*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Study Buddy - App*" >nul 2>&1

echo Done. Everything is stopped.
ping -n 4 127.0.0.1 >nul
exit /b 0

:killport
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /R /C:":%~1 .*LISTENING"') do (
  echo Stopping the %~2 ^(process %%p^)...
  taskkill /F /T /PID %%p >nul 2>&1
)
exit /b 0
