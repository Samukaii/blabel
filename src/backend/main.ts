import * as electron from 'electron';
import { join } from 'path';
import { currentWindow } from './core/current-window';
import { ipcHandlers } from './ipc-handlers.js';
import { registerHandlers } from './register-handlers';

electron.app.setPath(
	'userData',
	join(electron.app.getPath('home'), '.meu-app-cache'),
);

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
