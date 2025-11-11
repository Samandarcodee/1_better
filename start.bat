@echo off
title BetterHabit Server
cd /d "%~dp0"

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting server...
echo Local: http://localhost:5000
echo.
call npm run dev
