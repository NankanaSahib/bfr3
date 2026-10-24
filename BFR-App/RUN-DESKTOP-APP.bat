@echo off
cd /d "%~dp0"
title BFR Case Assistant - Quick Run

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is not installed on this PC.
  start https://nodejs.org/en/download
  pause
  exit /b 1
)

if not exist node_modules (
  echo First run: installing components (needs internet)...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo Install failed. Check your internet connection.
    pause
    exit /b 1
  )
)

call npm run desktop
if errorlevel 1 pause
