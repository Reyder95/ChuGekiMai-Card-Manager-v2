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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_store_1 = __importDefault(require("electron-store"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const exposed_functions_1 = require("./exposed_functions");
let mainWindow;
let settingsWindow;
let tray = null;
const store = new electron_store_1.default();
const lock = electron_1.app.requestSingleInstanceLock();
if (!lock) {
    electron_1.app.quit();
}
else {
    const createSettingsWindow = () => {
        settingsWindow = new electron_1.BrowserWindow({
            width: 400,
            height: 300,
            parent: mainWindow !== null && mainWindow !== void 0 ? mainWindow : undefined,
            modal: true,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: true
            }
        });
        settingsWindow.loadFile('./src/settings.html');
        settingsWindow.on('closed', () => {
            settingsWindow = null;
        });
    };
    const createWindow = () => {
        if (!tray) {
            tray = new electron_1.Tray(path.join(__dirname, "trayIcon.png"));
            const contextMenu = electron_1.Menu.buildFromTemplate([
                { label: 'Show Overlay', click: showOverlay },
                { label: 'Quit', click: quitApp }
            ]);
            tray.setToolTip('My Background App');
            tray.setContextMenu(contextMenu);
            tray.on('click', () => {
                showOverlay(); // Trigger showOverlay on tray icon click
            });
        }
        mainWindow = new electron_1.BrowserWindow({
            width: 400,
            height: 600,
            autoHideMenuBar: true,
            resizable: false,
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
        electron_1.globalShortcut.register('F1', () => handleSetHotkey('F1'));
        electron_1.globalShortcut.register('F2', () => handleSetHotkey('F2'));
        electron_1.globalShortcut.register('F3', () => handleSetHotkey('F3'));
        electron_1.globalShortcut.register('F4', () => handleSetHotkey('F4'));
        electron_1.globalShortcut.register('F5', () => handleSetHotkey('F5'));
        store.delete('card-keys');
        if (!store.has('card-keys')) {
            const keys = {
                F1: null,
                F2: null,
                F3: null,
                F4: null,
                F5: null
            };
            store.set('card-keys', keys);
        }
        if (!store.has('settings-card-list'))
            store.set('settings-card-list', []);
        store.delete('selected-settings-card');
    };
    const quitApp = () => {
        electron_1.app.quit(); // Quit the application
    };
    const showOverlay = () => {
        if (mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.isDestroyed())
            createWindow();
        if (mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.isVisible()) {
            settingsWindow === null || settingsWindow === void 0 ? void 0 : settingsWindow.close();
            settingsWindow = null;
            mainWindow.hide();
            console.log('test');
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
    electron_1.ipcMain.handle('write-aime-file', (event, fileName, cardId) => (0, exposed_functions_1.writeToAimeFile)(event, fileName, cardId, electron_1.app));
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
    electron_1.ipcMain.handle('open-settings-window', () => {
        if (!settingsWindow) {
            createSettingsWindow();
        }
    });
    electron_1.ipcMain.handle('store-get', (event, key) => {
        return store.get(key);
    });
    electron_1.ipcMain.handle('store-set', (event, key, value) => {
        store.set(key, value);
    });
    electron_1.ipcMain.handle('store-delete', (event, key) => {
        return store.delete(key);
    });
    const useHotkey = (key) => {
        let card = store.get(key);
        console.log(card);
        if (card) {
            store.set('curr-card', card);
        }
    };
    const handleSetHotkey = (key) => __awaiter(void 0, void 0, void 0, function* () {
        let selectedCardIndex = yield store.get('selected-settings-card');
        let settingsCards = yield store.get('settings-card-list');
        let cardKeys = yield store.get('card-keys');
        if (selectedCardIndex) {
            if (mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.isDestroyed()) {
                console.log('destroy');
            }
            else {
                // If the key already has a card assigned
                if (cardKeys[key] != null) {
                    let originalCardIndex = cardKeys[key]; // The index of the card currently assigned to the function key
                    let newCardIndex = selectedCardIndex; // The index of the card being selected
                    // Log the current cards for debugging
                    console.log("Original Card:", settingsCards[originalCardIndex]);
                    console.log("New Card:", settingsCards[newCardIndex]);
                }
                else {
                    // If the key is not currently assigned, assign it
                    if (settingsCards[selectedCardIndex].key != null) {
                        let oldKey = settingsCards[selectedCardIndex].key; // Get the old key if it exists
                        cardKeys[oldKey] = null; // Clear the old key from cardKeys
                    }
                    // Assign the new key to the card
                    cardKeys[key] = selectedCardIndex;
                    settingsCards[selectedCardIndex].key = key;
                }
                store.set('card-keys', cardKeys);
                store.set('settings-card-list', settingsCards);
                store.delete('selected-settings-card');
                console.log(cardKeys);
                console.log(settingsCards);
                settingsWindow === null || settingsWindow === void 0 ? void 0 : settingsWindow.webContents.send('set-card', key);
            }
        }
        else {
            useHotkey(key);
            if (mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.isDestroyed())
                console.log('destroy');
            else {
                mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send('global-shortcut-pressed', key);
            }
        }
    });
}
