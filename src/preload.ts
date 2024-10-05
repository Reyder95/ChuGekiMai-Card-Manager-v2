import { contextBridge, ipcRenderer } from 'electron';

// Expose a secure API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  readJsonFile: (fileName: string) => ipcRenderer.invoke('read-json-file', fileName),
  writeJsonFile: (fileName: string, data: any) => ipcRenderer.invoke('write-json-file', fileName, data),
  writeAimeFile: (fileName: string, cardId: string) => ipcRenderer.invoke('write-aime-file', fileName, cardId)
});