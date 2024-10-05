"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose a secure API to the renderer process
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    getAppPath: () => electron_1.ipcRenderer.invoke('get-app-path'),
    readJsonFile: (fileName) => electron_1.ipcRenderer.invoke('read-json-file', fileName),
    writeJsonFile: (fileName, data) => electron_1.ipcRenderer.invoke('write-json-file', fileName, data),
    writeAimeFile: (fileName, cardId) => electron_1.ipcRenderer.invoke('write-aime-file', fileName, cardId),
    openSettings: () => electron_1.ipcRenderer.invoke('open-settings-window'),
    onGlobalShortcut: (callback) => electron_1.ipcRenderer.on('global-shortcut-pressed', callback),
    storeGet: (key) => electron_1.ipcRenderer.invoke('store-get', key),
    storeSet: (key, value) => electron_1.ipcRenderer.invoke('store-set', key, value)
});
