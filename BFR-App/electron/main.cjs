'use strict';

/**
 * BFR Case Assistant - Windows desktop shell.
 * Starts the bundled Express server on a private local port (127.0.0.1 only)
 * and shows the app in a normal desktop window.
 */

const { app, BrowserWindow, Menu, dialog, session, shell } = require('electron');
const fs = require('fs');
const http = require('http');
const net = require('net');
const path = require('path');

const APP_TITLE = 'BFR Case Assistant';
let mainWindow = null;
let serverPort = 0;

function getFreePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.unref();
    probe.on('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

function waitForServer(port, timeoutMs = 20000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(
        { host: '127.0.0.1', port, path: '/api/settings', timeout: 1500 },
        (res) => {
          res.resume();
          resolve();
        }
      );
      req.on('timeout', () => req.destroy());
      req.on('error', retry);
    };
    const retry = () => {
      if (Date.now() - started > timeoutMs) {
        reject(new Error('The local BFR server did not start in time.'));
      } else {
        setTimeout(attempt, 250);
      }
    };
    attempt();
  });
}

async function startBackend() {
  const serverFile = path.join(__dirname, '..', 'dist-server', 'server.cjs');
  const distDir = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(serverFile) || !fs.existsSync(path.join(distDir, 'index.html'))) {
    throw new Error(
      'The app has not been built yet.\n\nRun "npm run desktop" (or BUILD-WINDOWS-APP.bat) instead of starting Electron directly.'
    );
  }

  serverPort = await getFreePort();
  process.env.NODE_ENV = 'production';
  process.env.BFR_PORT = String(serverPort);
  process.env.BFR_HOST = '127.0.0.1';
  process.env.BFR_DIST_DIR = distDir;
  process.env.BFR_DATA_DIR = app.getPath('userData');

  require(serverFile);
  await waitForServer(serverPort);
}

function buildMenu() {
  const template = [
    { label: 'File', submenu: [{ role: 'quit', label: 'Exit' }] },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () =>
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: APP_TITLE,
              message: APP_TITLE,
              detail:
                'Legal drafting assistant for Punjab trial courts.\nVersion ' +
                app.getVersion() +
                '\n\nYour Gemini API key is stored only on this computer.',
            }),
        },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow() {
  const origin = `http://127.0.0.1:${serverPort}`;

  mainWindow = new BrowserWindow({
    width: 1366,
    height: 860,
    minWidth: 1024,
    minHeight: 680,
    backgroundColor: '#f8fafc',
    title: APP_TITLE,
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  // Open external links in the normal browser, never inside the app window.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(origin)) {
      event.preventDefault();
      if (/^https?:/i.test(url)) shell.openExternal(url);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.loadURL(origin);
}

function fatal(err) {
  dialog.showErrorBox(APP_TITLE + ' - could not start', String((err && err.message) || err));
  app.quit();
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on('window-all-closed', () => app.quit());

  app
    .whenReady()
    .then(async () => {
      // The app needs no camera/mic/location etc.
      session.defaultSession.setPermissionRequestHandler((_wc, _perm, callback) => callback(false));
      buildMenu();
      await startBackend();
      createWindow();
    })
    .catch(fatal);
}
