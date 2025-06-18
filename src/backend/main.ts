import * as electron from 'electron';
import { currentWindow } from './core/current-window';
import { ipcHandlers } from './ipc-handlers.js';
import { registerHandlers } from './register-handlers';

electron.app.setName("Blabel");

registerHandlers(ipcHandlers);

electron.app.whenReady().then(() => {
	currentWindow.create();

	electron.app.on('activate', () => {
		if (
			process.platform === 'darwin' &&
			electron.BrowserWindow.getAllWindows().length === 0
		) {
			currentWindow.create();
		}
	});
});

electron.app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') electron.app.quit();
});
