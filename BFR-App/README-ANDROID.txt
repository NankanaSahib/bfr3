BFR CASE ASSISTANT - ANDROID APP (.APK)
=======================================

The app runs fully on the phone. There is no server: it reads the FIR by calling
Google Gemini directly with YOUR API key (saved only on the phone).
Internet is needed while using it.

HOW TO GET THE APK - choose ONE method
--------------------------------------------------------------------------
METHOD A (recommended - nothing to install on your PC): build it free on GitHub

  1. Create a free account at https://github.com and click  New repository
     (name it bfr, choose Private, click Create repository).
  2. On the new repository page click  "uploading an existing file".
  3. Unzip the project, open the folder, press Ctrl+A to select everything and
     drag it all into the browser. Make sure the folder named  .github  is
     included. Click  Commit changes.
     (If .github did not upload: click Add file > Create new file, type
      .github/workflows/build-apk.yml  as the name, paste the text of that file
      from the project, and commit.)
  4. Open the  Actions  tab. The job "Build Android APK" starts by itself
     (or click it > Run workflow). It takes about 8-12 minutes.
  5. Click the finished run, scroll to  Artifacts, download
     BFR-Case-Assistant-APK, unzip it: BFR-Case-Assistant.apk is inside.

METHOD B: build on your Windows PC

  1. Install Node.js LTS (https://nodejs.org).
  2. Install Android Studio (https://developer.android.com/studio), open it once
     and finish the setup wizard so it downloads the Android SDK.
     In Android Studio > SDK Manager, also tick "Android SDK Command-line Tools"
     and accept the licences if it asks.
  3. Double-click  BUILD-ANDROID-APK.bat  (first time: 10-20 minutes).
  4. The APK appears in the  release-android  folder.

INSTALL ON THE PHONE
--------------------------------------------------------------------------
  1. Send BFR-Case-Assistant.apk to the phone (USB cable, WhatsApp to yourself,
     Google Drive, etc.).
  2. Tap the file. If Android says "install unknown apps", tap Settings and allow
     it for the app you opened the file from (Files, Chrome, WhatsApp...).
  3. Tap Install. If Play Protect warns about an unknown developer, choose
     "Install anyway" (the app is signed with a debug key, not a Play Store key).
  4. Open "BFR Case Assistant", paste your Gemini API key when asked
     (free from https://aistudio.google.com/apikey).

USING IT ON ANDROID
--------------------------------------------------------------------------
  - Upload the FIR from Files or take a photo.
  - "Download Legal PDF" creates the court PDF and opens the Android share sheet:
    choose Save to Files / Drive, or send it to WhatsApp or a printer app.
  - The browser "Print" buttons are hidden on Android (phones cannot open the
    desktop print dialog). Print from the saved PDF instead - Legal paper size.

NOTES
--------------------------------------------------------------------------
  - The Windows desktop version in this same project still works as before
    (BUILD-WINDOWS-APP.bat).
  - Uninstalling the app also deletes the saved API key.
