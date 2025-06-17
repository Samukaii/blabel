import * as electron from 'electron';
import { dirname, join } from 'path';
import { fileURLToPath, format } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow: electron.BrowserWindow | null = null;

const get = () => {
	if (!mainWindow) {
		throw new Error('Main window is not created yet.');
	}
	return mainWindow;
}

const isProduction = () => {
	return electron.app.isPackaged;
};

const isDebugAllowed = () => {
	return true;
}

const getWindowUrl = () => {
	if (isProduction()) {
		return (
			format({
				pathname: join(__dirname, '..', '..', 'web', 'browser', 'index.html'),
				protocol: 'file:',
				slashes: true,
			}) + '#/translations'
		);
	} else {
		return 'http://localhost:4200';
	}
};

const create = () => {
	if (mainWindow) return;

	const icon = join(__dirname, '..', 'public', 'assets', 'icons', 'icon.ico');

	mainWindow = new electron.BrowserWindow({
		width: 1280,
		height: 800,
		x: 100,
		y: 100,
		frame: false,
		icon,
		show: true,
		webPreferences: {
			contextIsolation: true,
			devTools: isDebugAllowed(),
			preload: join(__dirname, '..', 'preload.generated.js'),
		},
	});

	mainWindow.loadURL(getWindowUrl()).then();

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
};

export const currentWindow = {
	get,
	create,
};
