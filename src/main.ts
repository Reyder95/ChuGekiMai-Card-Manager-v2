import { app, BrowserWindow, Tray, Menu, globalShortcut } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null;

let tray : Tray | null = null;
let overlayWindow = null;


const createWindow = () => {
    tray = new Tray(path.join(__dirname, "trayIcon.png"));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show Overlay', click: showOverlay },
        { label: 'Quit', click: () => app.quit() }
    ])

    tray.setToolTip('My Background App');
    tray.setContextMenu(contextMenu);

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        autoHideMenuBar: true,
        opacity: 0.8,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.on("close", (event: any) => {
        event.preventDefault();
        mainWindow?.hide();
    })

    mainWindow.loadFile('index.html');

    mainWindow.hide();

    globalShortcut.register('F7', () => {
        showOverlay();
    })
}

const showOverlay = () => {
    if (mainWindow?.isVisible()) {
        mainWindow.hide();
    } else {
        mainWindow?.show();
    }
}

app.whenReady().then(() => { setTimeout(() => { createWindow() }, 10) });

app.on('activate', () => {
    if (mainWindow == null) {
        createWindow();
    }
})