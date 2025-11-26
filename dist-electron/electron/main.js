"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
let mainWindow = null;
let serverProcess = null;
const isDev = process.env.NODE_ENV === 'development';
const port = 5000;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
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
                serverProcess = (0, child_process_1.spawn)('npx', ['tsx', serverScript], {
                    env,
                    stdio: 'inherit',
                });
            }
            else {
                // In production, run compiled JavaScript
                serverProcess = (0, child_process_1.spawn)('node', [serverScript], {
                    env,
                    stdio: 'inherit',
                });
            }
            serverProcess.on('error', (err) => {
                console.error('Failed to start server:', err);
                reject(err);
            });
            // Give server time to start
            setTimeout(() => resolve(true), 2000);
        }
        catch (err) {
            reject(err);
        }
    });
}
function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Exit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => {
                        electron_1.app.quit();
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
                        if (mainWindow)
                            mainWindow.reload();
                    },
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'F12',
                    click: () => {
                        if (mainWindow)
                            mainWindow.webContents.toggleDevTools();
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
    const menu = electron_1.Menu.buildFromTemplate(template);
    electron_1.Menu.setApplicationMenu(menu);
}
electron_1.app.on('ready', async () => {
    try {
        await startServer();
        createWindow();
        createMenu();
    }
    catch (err) {
        console.error('Failed to start app:', err);
        electron_1.app.quit();
    }
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('before-quit', () => {
    if (serverProcess) {
        serverProcess.kill();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
