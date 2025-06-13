import {app, BrowserWindow, dialog, ipcMain} from 'electron';
import {join} from 'path';
import {format} from 'url';
import {startAPI} from "./src";

app.setPath('userData', join(app.getPath('home'), '.meu-app-cache'));

let mainWindow: BrowserWindow | null = null;

ipcMain.handle('open-file-dialog', async () => {
    const {canceled, filePaths} = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{name: 'JSON', extensions: ['json']}],
    });
    if (canceled) return null;
    return filePaths[0];
});

ipcMain.on('window-close', () => {
    BrowserWindow.getFocusedWindow()?.close();
});

ipcMain.on('window-minimize', () => {
    BrowserWindow.getFocusedWindow()?.minimize();
});

ipcMain.on('window-maximize', () => {
    const window = BrowserWindow.getFocusedWindow();
    if (!window) return;
    if (window.isMaximized()) {
        window.unmaximize();
    } else {
        window.maximize();
    }
});

const logs: string[] = [];

function startBackend() {
    try {
        startAPI();
    } catch (error) {
        const err = error as any;
        logs.push(`[🛰️ API] ❌ Erro inesperado ao importar backend:`);
        logs.push(err?.stack || err?.message || JSON.stringify(err));
    }
}

function createMainWindow() {
    if (mainWindow) return;

    const isDev = !app.isPackaged;

    const icon = join(__dirname, 'assets', 'icons', 'icon.ico');

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        x: 100,
        y: 100,
        titleBarStyle: "hidden",
        frame: false,
        icon,
        show: true,
        webPreferences: {
            contextIsolation: true,
            devTools: isDev,
            preload: join(__dirname, 'preload.js'),
        },
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:4200');
    } else {
        mainWindow.loadURL(format({
            pathname: join(__dirname, 'web', 'dist', 'browser', 'index.csr.html'),
            protocol: 'file:',
            slashes: true,
        }) + '#/translations');
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    startBackend();
    createMainWindow();

    app.on('activate', () => {
        if (process.platform === 'darwin' && BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
