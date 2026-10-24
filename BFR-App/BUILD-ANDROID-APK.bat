@echo off
cd /d "%~dp0"
title BFR Case Assistant - Build Android APK

echo ============================================================
echo   BFR Case Assistant - building the Android APK
echo   (needs internet; first time takes 10-20 minutes)
echo ============================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is not installed on this PC.
  echo Opening the download page. Install the LTS version, then run this file again.
  start https://nodejs.org/en/download
  pause
  exit /b 1
)

if not exist "%LOCALAPPDATA%\Android\Sdk" if "%ANDROID_HOME%"=="" (
  echo Android Studio / Android SDK was not found on this PC.
  echo.
  echo 1. Install Android Studio:  https://developer.android.com/studio
  echo 2. Open it once and finish the setup wizard so it downloads the SDK.
  echo 3. Run this file again.
  echo.
  echo ^(Prefer not to install Android Studio? Use the GitHub method in README-ANDROID.txt^)
  start https://developer.android.com/studio
  pause
  exit /b 1
)

echo [1/2] Installing components...
call npm install --no-audit --no-fund
if errorlevel 1 goto :fail

echo.
echo [2/2] Building the APK...
call npm run android:apk
if errorlevel 1 goto :fail

echo.
echo ============================================================
echo   DONE. Your APK is here:
echo     release-android\BFR-Case-Assistant.apk
echo   Copy it to your phone and tap it to install.
echo ============================================================
explorer "%~dp0release-android"
pause
exit /b 0

:fail
echo.
echo Something went wrong. Check your internet connection and run this file again.
echo If it keeps failing, send a screenshot of this window.
pause
exit /b 1
