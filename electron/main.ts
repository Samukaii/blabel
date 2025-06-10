import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';

ipcMain.handle('open-file-dialog', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'JSON', extensions: ['json'] }],
    });

    if (canceled) return null;
    return filePaths[0];
});

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        x: 100,
        y: 100,
        show: true,
        webPreferences: {
            contextIsolation: true,
            preload: join(__dirname, 'preload.js') // <-- Aqui
        }
    });

    win.loadURL('http://localhost:4200');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
