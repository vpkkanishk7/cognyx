@echo off
title COGNYX - Clinical Diagnostic & Digital Phenotyping Engine
color 0B

echo ===================================================================
echo               COGNYX HEALTH SCIENCES ENGINE
echo         Precision Digital Phenotyping & Diagnostic AI
echo ===================================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting Python ML Microservice on port 8000...
start "COGNYX ML Microservice (Port 8000)" cmd /k "cd ml_service && py -3.13 -m uvicorn main:app --port 8000 --reload"

echo [2/3] Waiting for ML Microservice initialization...
timeout /t 2 /nobreak >nul

echo [3/3] Launching COGNYX Clinical Web Application...
start http://localhost:3005

echo.
echo ===================================================================
echo Express Backend Server starting on http://localhost:3005
echo Serving: Frontend UI + REST APIs + SQLite Database + Gemini Vision
echo Press Ctrl+C to stop the backend server.
echo ===================================================================
echo.

node backend/server.js
pause
