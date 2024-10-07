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

        globalShortcut.register('F1', () => handleSetHotkey('F1'))
        globalShortcut.register('F2', () => handleSetHotkey('F2'))
        globalShortcut.register('F3', () => handleSetHotkey('F3'))
        globalShortcut.register('F4', () => handleSetHotkey('F4'))
        globalShortcut.register('F5', () => handleSetHotkey('F5'))

        store.delete('card-keys');

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

        store.delete('selected-settings-card');
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

    ipcMain.handle('store-delete', (event, key) => {
        return store.delete(key);
    })

    const useHotkey = (key: string) => {
        let card = store.get(key);

        console.log(card);

        if (card) {
            store.set('curr-card', card);
        }
    }

    const handleSetHotkey = async (key: any) => {
        let selectedCardIndex: any = await store.get('selected-settings-card');
        let settingsCards: any = await store.get('settings-card-list');
        let cardKeys: any = await store.get('card-keys');

        if (selectedCardIndex) {
            if (mainWindow?.isDestroyed()) {
                console.log('destroy')
            } else {

    // If the key already has a card assigned
    if (cardKeys[key] != null) {
        let originalCardIndex = cardKeys[key]; // The index of the card currently assigned to the function key
        let newCardIndex = selectedCardIndex; // The index of the card being selected

        // Log the current cards for debugging
        console.log("Original Card:", settingsCards[originalCardIndex]);
        console.log("New Card:", settingsCards[newCardIndex]);
        
        
    } else {
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
                store.delete('selected-settings-card')

                console.log(cardKeys);
                console.log(settingsCards);

                settingsWindow?.webContents.send('set-card', key);
            }
        } else {
            useHotkey(key);

            if (mainWindow?.isDestroyed())
                console.log('destroy')
            else {
                mainWindow?.webContents.send('global-shortcut-pressed', key);
            }
        }
    }
}