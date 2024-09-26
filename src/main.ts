import { app, BrowserWindow, Tray, Menu, globalShortcut } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null;

let tray : Tray | null = null;
let overlayWindow = null;


const createWindow = () => {
    tray = new Tray(path.join(__dirname, "trayIcon.png"));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show Overlay', click: showOverlay },
        { label: 'Quit', click: quitApp}
    ])

    tray.setToolTip('My Background App');
    tray.setContextMenu(contextMenu);

    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        resizable: false,
        autoHideMenuBar: true,
        opacity: 0.8,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadFile('index.html');

    mainWindow.hide();

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

app.whenReady().then(() => { setTimeout(() => { createWindow() }, 10) });

app.on('window-all-closed', (event: any) => {
    event.preventDefault()
    //app.quit();
})

app.on('activate', () => {
    createWindow();
    
})