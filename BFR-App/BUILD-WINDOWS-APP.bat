@echo off
cd /d "%~dp0"
title BFR Case Assistant - Build Windows App

rem --- electron-builder needs administrator rights on Windows 10 (to unpack its tools) ---
net session >nul 2>&1
if %errorlevel% neq 0 (
  echo Asking for administrator permission...
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)

echo ============================================================
echo   BFR Case Assistant - building the Windows app
echo   (needs internet and takes about 5-10 minutes the first time)
echo ============================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is not installed on this PC.
  echo Opening the download page. Install the LTS version, then run this file again.
  start https://nodejs.org/en/download
  echo.
  pause
  exit /b 1
)

echo [1/2] Installing components...
call npm install --no-audit --no-fund
if errorlevel 1 goto :fail

echo.
echo [2/2] Building the installer...
set CSC_IDENTITY_AUTO_DISCOVERY=false
call npm run dist
if errorlevel 1 goto :fail

echo.
echo ============================================================
echo   DONE. Your app is in the "release" folder:
echo     BFR-Case-Assistant-Setup-1.0.0.exe     (installer)
echo     BFR-Case-Assistant-Portable-1.0.0.exe  (no install needed)
echo ============================================================
explorer "%~dp0release"
pause
exit /b 0

:fail
echo.
echo Something went wrong. Please check your internet connection and run this file again.
echo If it keeps failing, send a screenshot of this window.
pause
exit /b 1
