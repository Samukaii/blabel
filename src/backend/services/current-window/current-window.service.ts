import * as electron from 'electron';
import { dirname, join } from 'path';
import { fileURLToPath, format } from 'url';
import { Injectable } from '../../di/di';
import { isProduction } from '../../utils/is-production';
import { isDebugAllowed } from '../../utils/is-debug-allowed';


@Injectable({providedIn: 'root'})
export class CurrentWindowService {
	private mainWindow: electron.BrowserWindow | null = null;
	private fileName = fileURLToPath(import.meta.url);
	private dirName = dirname(this.fileName);

	get() {
		if (!this.mainWindow) {
			throw new Error('Main window is not created yet.');
		}
		return this.mainWindow;
	}

	async getWindowUrl() {
		if (isProduction()) {
			return (
				format({
					pathname: join(this.dirName, '..', '..', 'web', 'browser', 'index.html'),
					protocol: 'file:',
					slashes: true,
				}) + '#/translations'
			);
		} else {
			return 'http://localhost:4200';
		}
	};

	async create() {
		if (this.mainWindow) return;

		const windowUrl = await this.getWindowUrl();

		const icon = join(this.dirName, '..', 'public', 'assets', 'icons', 'icon.ico');

		this.mainWindow = new electron.BrowserWindow({
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
				preload: join(this.dirName, '..', '..', 'preload.generated.js'),
			},
		});

		this.mainWindow.webContents.openDevTools({
			mode: 'detach',
		});

		this.mainWindow.loadURL(windowUrl).then();

		this.mainWindow.on('closed', () => {
			this.mainWindow = null;
		});
	};
}
