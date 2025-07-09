import * as electron from 'electron';
import { CurrentWindowService } from './services/current-window/current-window.service';
import { registerHandlers } from './register-handlers';
import { configDotenv } from 'dotenv';
import { inject } from './di/di';

export const bootstrap = () => {
	configDotenv()

	electron.app.setName("Blabel");

	registerHandlers();

	const currentWindow = inject(CurrentWindowService)

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

}
