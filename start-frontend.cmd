@echo off
title Study Buddy - Angular
cd /D "%~dp0frontend"
call npx ng serve --port 4200 --open
