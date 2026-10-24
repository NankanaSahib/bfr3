BFR CASE ASSISTANT - WINDOWS 10 DESKTOP VERSION
================================================

WHAT YOU GET
  A normal Windows program (installer + portable .exe) with its own window,
  desktop shortcut and Start Menu entry. No browser, no commands needed after
  the one-time build below.

ONE-TIME BUILD (about 10 minutes, internet required)
  1. Install Node.js LTS from https://nodejs.org (click Next, Next, Finish).
  2. Unzip this folder anywhere (for example C:\BFR).
  3. Double-click  BUILD-WINDOWS-APP.bat  and click "Yes" when Windows asks
     for permission.
  4. When it finishes, the "release" folder opens:
        BFR-Case-Assistant-Setup-1.0.0.exe     -> installs the app
        BFR-Case-Assistant-Portable-1.0.0.exe  -> runs without installing
  5. Install it (or copy the files to any other Windows 10/11 PC). Node.js is
     NOT needed on the PCs where you only use the finished app.

FIRST LAUNCH
  The app asks for your Gemini API key (free from https://aistudio.google.com/apikey).
  Paste it once. It is saved only on your PC and can be changed any time with the
  "API Key" button at the top right.
  Internet is needed while using the app (FIR reading is done by Gemini).

QUICK TEST WITHOUT BUILDING THE INSTALLER
  Double-click RUN-DESKTOP-APP.bat. It opens the desktop window straight away.

NOTES
  - Your data/key are stored in:  %APPDATA%\BFR Case Assistant
  - The app server listens on 127.0.0.1 only, so nobody else on your network
    can reach it or use your key.
  - Windows SmartScreen may say "unknown publisher" the first time because the
    app is not code-signed. Click "More info" -> "Run anyway".
  - If the Electron download is blocked on your network: open Command Prompt
    AS ADMINISTRATOR in this folder and run these three lines:
        set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
        npm install
        npm run dist
