@echo off
setlocal
title Study Buddy
cd /D "%~dp0"
set "ROOT=%~dp0"
set "XAMPP=C:\xampp"
set "PY=%ROOT%backend\venv\Scripts\python.exe"

echo ==========================================
echo   Study Buddy - starting everything
echo ==========================================
echo.

REM ---------------------------------------------------------------- 1. MySQL
tasklist /FI "IMAGENAME eq mysqld.exe" | find /I "mysqld.exe" >nul
if errorlevel 1 (
  if not exist "%XAMPP%\mysql\bin\mysqld.exe" (
    echo XAMPP was not found at %XAMPP%. Install XAMPP first, then run this again.
    pause
    exit /b 1
  )
  echo [1/5] Starting MySQL ^(XAMPP^)...
  start "Study Buddy - MySQL" /MIN cmd /c "cd /D "%XAMPP%" && mysql\bin\mysqld --defaults-file=mysql\bin\my.ini --standalone"
) else (
  echo [1/5] MySQL is already running.
)
call :waitport 3306 60
if errorlevel 1 (
  echo MySQL did not start. Open the XAMPP Control Panel and start MySQL, then run this again.
  pause
  exit /b 1
)

REM ---------------------------------------------------------------- 2. Backend
if not exist "%PY%" (
  echo [2/5] First run: creating the Python environment ^(about a minute^)...
  python -m venv backend\venv
  if errorlevel 1 (
    echo Python 3 is not installed or not on the PATH. Install it from python.org and run this again.
    pause
    exit /b 1
  )
  "%PY%" -m pip install --quiet --upgrade pip
  "%PY%" -m pip install --quiet -r backend\requirements.txt
)
echo [2/5] Preparing the database...
"%PY%" backend\manage.py createdb
"%PY%" backend\manage.py migrate --noinput >nul
"%PY%" backend\manage.py seed

REM ---------------------------------------------------------------- 3. Frontend packages
if not exist "frontend\node_modules\.bin\ng.cmd" (
  echo [3/5] First run: installing web packages ^(a few minutes^)...
  pushd frontend
  call npm install --no-audit --no-fund
  popd
) else (
  echo [3/5] Web packages are ready.
)

REM ---------------------------------------------------------------- 4. API server
call :portbusy 8000
if not errorlevel 1 (
  echo [4/5] The API is already running on port 8000.
) else (
  echo [4/5] Starting the API ^(Django^) on http://127.0.0.1:8000 ...
  start "Study Buddy - API" /MIN cmd /c ""%PY%" backend\manage.py runserver 127.0.0.1:8000"
)

REM ---------------------------------------------------------------- 5. Web app
call :portbusy 4200
if not errorlevel 1 (
  echo [5/5] The app is already running on port 4200.
) else (
  echo [5/5] Starting the app ^(Angular^) on http://localhost:4200 ... this takes about a minute the first time.
  start "Study Buddy - App" /MIN cmd /c "cd /D "%ROOT%frontend" && npx ng serve --port 4200"
)

echo.
echo Waiting for the app to compile...
call :waitport 4200 240
if errorlevel 1 (
  echo The app did not start within 4 minutes. Look at the "Study Buddy - App" window on the taskbar for errors.
  pause
  exit /b 1
)
start "" http://localhost:4200

echo.
echo ==========================================
echo   Study Buddy is running
echo   http://localhost:4200
echo ==========================================
echo.
echo Three minimised windows on the taskbar keep it running: MySQL, API and App.
echo To stop everything, double-click stop.bat.
echo You can close this window now.
pause
exit /b 0

REM ---------------------------------------------------------------- helpers
:waitport
REM %1 = port, %2 = seconds to wait. Returns 0 when something is listening.
set /a wp_tries=%2
:wp_loop
netstat -an | findstr /R /C:":%1 .*LISTENING" >nul
if not errorlevel 1 exit /b 0
set /a wp_tries-=1
if %wp_tries% LEQ 0 exit /b 1
ping -n 2 127.0.0.1 >nul
goto wp_loop

:portbusy
REM Returns 0 when %1 is already listening.
netstat -an | findstr /R /C:":%1 .*LISTENING" >nul
exit /b %errorlevel%
