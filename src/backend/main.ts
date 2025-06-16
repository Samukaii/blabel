import * as electron from 'electron';
import { dirname, join } from 'path';
import { fileURLToPath, format } from 'url';
import { ipcHandlers } from './ipc-handlers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

electron.app.setPath('userData', join(electron.app.getPath('home'), '.meu-app-cache'));

let mainWindow: electron.BrowserWindow | null = null;

function registerHandlers(obj: any, path: string[] = []) {
	for (const key in obj) {
		const value = obj[key];
		const fullPath = [...path, key];

		if (typeof value === "function") {
			const channel = fullPath.join(":");
			electron.ipcMain.handle(channel, async (event, ...args) => {
				return await value(...args);
			});
		} else if (typeof value === "object" && value !== null) {
			registerHandlers(value, fullPath);
		}
	}
}

registerHandlers(ipcHandlers);

function createMainWindow() {
    if (mainWindow) return;

    const isDev = !electron.app.isPackaged;

    const icon = join(__dirname, 'public', 'assets', 'icons', 'icon.ico');

    mainWindow = new electron.BrowserWindow({
        width: 1280,
        height: 800,
        x: 100,
        y: 100,
        titleBarStyle: 'hidden',
        frame: false,
        icon,
        show: true,
        webPreferences: {
            contextIsolation: true,
            devTools: isDev,
            preload: join(__dirname, 'preload.generated.js'),
        },
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:4200').then();
    } else {
        mainWindow.loadURL(format({
            pathname: join(__dirname, '..', 'web', 'browser', 'index.html'),
            protocol: 'file:',
            slashes: true,
        }) + '#/translations').then();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

electron.app.whenReady().then(() => {
    createMainWindow();

	electron.app.on('activate', () => {
        if (process.platform === 'darwin' && electron.BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

electron.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') electron.app.quit();
});
