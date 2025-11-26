import { app, BrowserWindow, Menu } from 'electron';
import * as path from 'path';
import { spawn } from 'child_process';

let mainWindow: BrowserWindow | null = null;
let serverProcess: any = null;

const isDev = process.env.NODE_ENV === 'development';
const port = 5000;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  });

  const startUrl = `http://localhost:${port}`;
  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startServer() {
  return new Promise((resolve, reject) => {
    const serverScript = isDev
      ? path.join(__dirname, '../server/index-dev.ts')
      : path.join(__dirname, '../dist/index.js');

    const env = { ...process.env, NODE_ENV: isDev ? 'development' : 'production' };

    try {
      if (isDev) {
        // In development, use tsx to run TypeScript directly
        serverProcess = spawn('npx', ['tsx', serverScript], {
          env,
          stdio: 'inherit',
        });
      } else {
        // In production, run compiled JavaScript
        serverProcess = spawn('node', [serverScript], {
          env,
          stdio: 'inherit',
        });
      }

      serverProcess.on('error', (err: any) => {
        console.error('Failed to start server:', err);
        reject(err);
      });

      // Give server time to start
      setTimeout(() => resolve(true), 2000);
    } catch (err) {
      reject(err);
    }
  });
}

function createMenu() {
  const template: any = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow) mainWindow.reload();
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'F12',
          click: () => {
            if (mainWindow) mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About WhatStock',
          click: () => {
            console.log('WhatStock - Whatnot Inventory Manager v1.0.0');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.on('ready', async () => {
  try {
    await startServer();
    createWindow();
    createMenu();
  } catch (err) {
    console.error('Failed to start app:', err);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
