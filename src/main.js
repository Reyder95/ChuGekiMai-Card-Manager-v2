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
let mainWindow;
let tray = null;
let overlayWindow = null;
const createWindow = () => {
    tray = new electron_1.Tray(path.join(__dirname, "trayIcon.png"));
    const contextMenu = electron_1.Menu.buildFromTemplate([
        { label: 'Show Overlay', click: showOverlay },
        { label: 'Quit', click: () => electron_1.app.quit() }
    ]);
    tray.setToolTip('My Background App');
    tray.setContextMenu(contextMenu);
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        autoHideMenuBar: true,
        opacity: 0.8,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.on("close", (event) => {
        event.preventDefault();
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.hide();
    });
    mainWindow.loadFile('index.html');
    mainWindow.hide();
    electron_1.globalShortcut.register('F7', () => {
        showOverlay();
    });
};
const showOverlay = () => {
    if (mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.isVisible()) {
        mainWindow.hide();
    }
    else {
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.show();
    }
};
electron_1.app.whenReady().then(() => { setTimeout(() => { createWindow(); }, 10); });
electron_1.app.on('activate', () => {
    if (mainWindow == null) {
        createWindow();
    }
});
