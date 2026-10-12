@echo off
title Study Buddy - Django API
cd /D "%~dp0backend"
venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
