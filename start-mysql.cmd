@echo off
title Study Buddy - MySQL (XAMPP)
tasklist /FI "IMAGENAME eq mysqld.exe" | find /I "mysqld.exe" >nul
if %errorlevel%==0 (
  echo MySQL is already running.
  exit /b 0
)
cd /D C:\xampp
echo Starting MySQL (MariaDB) from XAMPP... keep this window open.
mysql\bin\mysqld --defaults-file=mysql\bin\my.ini --standalone
