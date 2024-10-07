import { contextBridge, ipcRenderer } from 'electron';

// Expose a secure API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  readJsonFile: (fileName: string) => ipcRenderer.invoke('read-json-file', fileName),
  writeJsonFile: (fileName: string, data: any) => ipcRenderer.invoke('write-json-file', fileName, data),
  writeAimeFile: (fileName: string, cardId: string) => ipcRenderer.invoke('write-aime-file', fileName, cardId),
  openSettings: () => ipcRenderer.invoke('open-settings-window'),
  onGlobalShortcut: (callback: (event: any, key: string) => void) => ipcRenderer.on('global-shortcut-pressed', callback),
  storeGet: (key: any) => ipcRenderer.invoke('store-get', key),
  storeSet: (key: any, value: any) => ipcRenderer.invoke('store-set', key, value),
  storeDelete: (key: any) => ipcRenderer.invoke('store-delete', key),
  setCard: (callback: (event: any, key: string) => void) => ipcRenderer.on('set-card', callback)
});