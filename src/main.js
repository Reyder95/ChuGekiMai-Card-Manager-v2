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
const fs = __importStar(require("fs"));
let mainWindow;
let tray = null;
const createWindow = () => {
    tray = new electron_1.Tray(path.join(__dirname, "trayIcon.png"));
    const contextMenu = electron_1.Menu.buildFromTemplate([
        { label: 'Show Overlay', click: showOverlay },
        { label: 'Quit', click: quitApp }
    ]);
    tray.setToolTip('My Background App');
    tray.setContextMenu(contextMenu);
    mainWindow = new electron_1.BrowserWindow({
        width: 400,
        height: 600,
        resizable: false,
        autoHideMenuBar: true,
        opacity: 0.8,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true, // Isolate context for security
        }
    });
    console.log(__dirname);
    mainWindow.loadFile('./src/index.html');
    mainWindow.hide();
    mainWindow.webContents.openDevTools();
    electron_1.globalShortcut.register('F7', () => {
        showOverlay();
    });
};
const quitApp = () => {
    electron_1.app.quit(); // Quit the application
};
const showOverlay = () => {
    if (mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.isDestroyed())
        createWindow();
    if (mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.isVisible()) {
        mainWindow.hide();
    }
    else {
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.show();
    }
};
electron_1.app.whenReady().then(() => {
    setTimeout(() => {
        createWindow();
    }, 10);
});
electron_1.app.on('window-all-closed', (event) => {
    event.preventDefault();
    //app.quit();
});
electron_1.app.on('activate', () => {
    createWindow();
});
// TODO: Fix error "any"
electron_1.ipcMain.handle('read-json-file', (event, fileName) => {
    let exeDirectory;
    if (electron_1.app.isPackaged)
        exeDirectory = path.join(electron_1.app.getAppPath(), '../..');
    else
        exeDirectory = electron_1.app.getAppPath();
    const filePath = path.join(exeDirectory, fileName);
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        return { error: error.message };
    }
});
electron_1.ipcMain.handle('write-json-file', (event, fileName, data) => {
    let exeDirectory;
    if (electron_1.app.isPackaged)
        exeDirectory = path.join(electron_1.app.getAppPath(), '../..');
    else
        exeDirectory = electron_1.app.getAppPath();
    const filePath = path.join(exeDirectory, fileName);
    console.log(filePath);
    console.log(electron_1.app.isPackaged);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }
    catch (error) {
        return { error: error.message };
    }
});
electron_1.ipcMain.handle('get-app-path', () => {
    return electron_1.app.getAppPath();
});
