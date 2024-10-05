import { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, IpcMainInvokeEvent } from 'electron';
import { CardData } from './interfaces'
import * as path from 'path';
import * as fs from 'fs'

let mainWindow: BrowserWindow | null;

let tray : Tray | null = null;

const lock = app.requestSingleInstanceLock();

if (!lock) {
    app.quit();
} else {

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
    }

    const quitApp = () => {
        app.quit(); // Quit the application
    };

    const showOverlay = () => {
        if (mainWindow?.isDestroyed())
            createWindow();

        if (mainWindow?.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow?.show();
        }
    }

    app.whenReady().then(() => { 

        setTimeout(() => { createWindow() 

        }, 10) });

    app.on('window-all-closed', (event: any) => {
        event.preventDefault()
        //app.quit();
    })

    app.on('activate', () => {
        createWindow();

    })

    ipcMain.handle('write-aime-file', (event: IpcMainInvokeEvent, fileName: string, cardId: string) => {
        let exeDirectory;

        if (app.isPackaged)
            exeDirectory = path.join(app.getAppPath(), '../../..')
        else
            exeDirectory = app.getAppPath();

        const filePath = path.join(exeDirectory, fileName);

        try {
            fs.writeFileSync(filePath, cardId, 'utf-8');
        } catch (error: any) {
            return { error: error.message }
        }
    })

    // TODO: Fix error "any"
    ipcMain.handle('read-json-file', (event: IpcMainInvokeEvent, fileName: string) : CardData | any => {
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

        console.log(filePath);
        console.log(app.isPackaged);

        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error: any) {
            return { error: error.message }
        }
    })

    ipcMain.handle('get-app-path', () => {
        return app.getAppPath();
    })
}