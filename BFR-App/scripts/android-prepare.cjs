'use strict';

/**
 * Builds the Android app.
 *   node scripts/android-prepare.cjs          -> web build + native project + sync
 *   node scripts/android-prepare.cjs --apk    -> also compiles release-android/BFR-Case-Assistant.apk
 */

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = path.resolve(__dirname, '..');
const isWin = process.platform === 'win32';
const wantApk = process.argv.includes('--apk');
const env = { ...process.env };

function run(cmd, cwd = root) {
  console.log('\n> ' + cmd);
  execSync(cmd, { cwd, stdio: 'inherit', env });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function findSdk() {
  const candidates = [env.ANDROID_HOME, env.ANDROID_SDK_ROOT];
  if (isWin && env.LOCALAPPDATA) candidates.push(path.join(env.LOCALAPPDATA, 'Android', 'Sdk'));
  if (process.platform === 'darwin') candidates.push(path.join(os.homedir(), 'Library', 'Android', 'sdk'));
  candidates.push(path.join(os.homedir(), 'Android', 'Sdk'));
  return candidates.find((c) => c && fs.existsSync(c));
}

function ensureJava() {
  if (env.JAVA_HOME && fs.existsSync(env.JAVA_HOME)) return;
  if (!isWin) return;
  const pf = [env.ProgramFiles, env['ProgramFiles(x86)'], env.LOCALAPPDATA && path.join(env.LOCALAPPDATA, 'Programs')];
  for (const base of pf.filter(Boolean)) {
    const jbr = path.join(base, 'Android', 'Android Studio', 'jbr');
    if (fs.existsSync(path.join(jbr, 'bin', 'java.exe'))) {
      env.JAVA_HOME = jbr;
      env.PATH = path.join(jbr, 'bin') + path.delimiter + env.PATH;
      console.log('Using Java from Android Studio: ' + jbr);
      return;
    }
  }
}

// 1) Build the web app in "android" mode (no server; Gemini is called from inside the app)
run('npx vite build --mode android --outDir dist-android --emptyOutDir');

// 2) Create the native Android project the first time
if (!fs.existsSync(path.join(root, 'android'))) run('npx cap add android');

// 3) Apply our launcher icon
copyDir(path.join(root, 'android-res'), path.join(root, 'android', 'app', 'src', 'main', 'res'));

// 4) Copy the web build into the native project
run('npx cap sync android');

if (!wantApk) {
  console.log('\nAndroid project is ready in the "android" folder.');
  process.exit(0);
}

// 5) Compile the APK
const sdk = findSdk();
if (!sdk) {
  console.error(
    '\nAndroid SDK not found.\nInstall Android Studio (https://developer.android.com/studio), open it once and finish the\nsetup wizard so it downloads the Android SDK, then run this again.'
  );
  process.exit(1);
}
env.ANDROID_HOME = sdk;
env.ANDROID_SDK_ROOT = sdk;
fs.writeFileSync(path.join(root, 'android', 'local.properties'), 'sdk.dir=' + sdk.replace(/\\/g, '\\\\') + '\n');
ensureJava();

const androidDir = path.join(root, 'android');
if (!isWin) fs.chmodSync(path.join(androidDir, 'gradlew'), 0o755);
run((isWin ? 'gradlew.bat' : './gradlew') + ' assembleDebug', androidDir);

const apk = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
if (!fs.existsSync(apk)) {
  console.error('\nBuild finished but the APK file was not found at ' + apk);
  process.exit(1);
}
const outDir = path.join(root, 'release-android');
fs.mkdirSync(outDir, { recursive: true });
const finalApk = path.join(outDir, 'BFR-Case-Assistant.apk');
fs.copyFileSync(apk, finalApk);
console.log('\nDONE. APK: ' + finalApk);
