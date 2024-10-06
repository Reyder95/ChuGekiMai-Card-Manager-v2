import { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, IpcMainInvokeEvent } from 'electron';
import { CardData, Settings } from './interfaces'
import Store from 'electron-store';
import * as path from 'path';
import * as fs from 'fs'
import { writeToAimeFile } from './exposed_functions';

let mainWindow: BrowserWindow | null;
let settingsWindow: BrowserWindow | null;

let tray : Tray | null = null;

const store = new Store();

const lock = app.requestSingleInstanceLock();

if (!lock) {
    app.quit();
} else {

    const createSettingsWindow = () => {
        settingsWindow = new BrowserWindow({
            width: 400,
            height: 300,
            parent: mainWindow ?? undefined,
            modal: true,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: true
            }
        })

        settingsWindow.loadFile('./src/settings.html');

        settingsWindow.on('closed', () => {
            settingsWindow = null;
        })
    }

    const createWindow = () => {
        if (!tray) {
            tray = new Tray(path.join(__dirname, "trayIcon.png"));
            const contextMenu = Menu.buildFromTemplate([
                { label: 'Show Overlay', click: showOverlay },
                { label: 'Quit', click: quitApp}
            ])
        
            tray.setToolTip('My Background App');
            tray.setContextMenu(contextMenu);

            tray.on('click', () => {
                showOverlay(); // Trigger showOverlay on tray icon click
            });
        }

        mainWindow = new BrowserWindow({
            width: 400,
            height: 600,
            autoHideMenuBar: true,
            resizable: false,
            opacity: 0.8,
            webPreferences: {
                nodeIntegration: false,
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: true,                      // Isolate context for security
            }
        })

        console.log(__dirname)

        mainWindow.loadFile('./src/index.html');

        mainWindow.hide();

        mainWindow.webContents.openDevTools();

        globalShortcut.register('F7', () => {
            showOverlay();
        })

        globalShortcut.register('F1', () => {
            useHotkey('F1');

            if (mainWindow?.isDestroyed())
                console.log('destroy')
            else {
                mainWindow?.webContents.send('global-shortcut-pressed', 'F1');
            }
        })

        if (!store.has('card-keys')) {
            const keys = {
                F1: null,
                F2: null,
                F3: null,
                F4: null,
                F5: null
            }

            store.set('card-keys', keys);
        }

        if (!store.has('settings-card-list'))
            store.set('settings-card-list', []);
    }

    const quitApp = () => {
        app.quit(); // Quit the application
    };

    const showOverlay = () => {
        if (mainWindow?.isDestroyed())
            createWindow();

        if (mainWindow?.isVisible()) {
            settingsWindow?.close();
            settingsWindow = null;
            mainWindow.hide();
            console.log('test');
        } else {
            mainWindow?.show();
        }
    }

    app.whenReady().then(() => { 

        setTimeout(() => { createWindow() 

        }, 10) 
    });

    app.on('window-all-closed', (event: any) => {
        event.preventDefault()
        //app.quit();
    })

    app.on('activate', () => {
        createWindow();

    })

    ipcMain.handle('write-aime-file', (event: IpcMainInvokeEvent, fileName: string, cardId: string) => writeToAimeFile(event, fileName, cardId, app))

    // TODO: Fix error "any"
    ipcMain.handle('read-json-file', (event: IpcMainInvokeEvent, fileName: string) : CardData | any | Settings => {
        let exeDirectory;

        if (app.isPackaged)
            exeDirectory = path.join(app.getAppPath(), '../..');
        else
            exeDirectory = app.getAppPath();

        const filePath = path.join(exeDirectory, fileName);

        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data) as CardData;
        } catch (error: any) {
            return { error: error.message }
        }
    })

    ipcMain.handle('write-json-file', (event: IpcMainInvokeEvent, fileName: string, data: CardData[]) => {
        let exeDirectory;

        if (app.isPackaged)
            exeDirectory = path.join(app.getAppPath(), '../..');
        else
            exeDirectory = app.getAppPath();
        const filePath = path.join(exeDirectory, fileName);

        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error: any) {
            return { error: error.message }
        }
    })

    ipcMain.handle('get-app-path', () => {
        return app.getAppPath();
    })

    ipcMain.handle('open-settings-window', () => {
        if (!settingsWindow) {
            createSettingsWindow();
        }
    })

    ipcMain.handle('store-get', (event, key) => {
        return store.get(key);
    });

    ipcMain.handle('store-set', (event, key, value) => {
        store.set(key, value);
    })

    const useHotkey = (key: string) => {
        let card = store.get(key);

        console.log(card);

        if (card) {
            store.set('curr-card', card);
        }
    }
}