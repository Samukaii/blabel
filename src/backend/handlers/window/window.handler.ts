import * as electron from 'electron';
import { Injectable } from '../../di/di';
import { ElectronFeatures } from '@shared/models/electron-features';

type Interface = ElectronFeatures['window'];

@Injectable({providedIn: 'root'})
export class WindowHandler implements Interface {
	async close() {
		electron.BrowserWindow.getFocusedWindow()?.close();
	}

	async minimize() {
		electron.BrowserWindow.getFocusedWindow()?.minimize();
	}

	async maximize() {
		const window = electron.BrowserWindow.getFocusedWindow();
		if (!window) return;
		if (window.isMaximized()) {
			window.unmaximize();
		} else {
			window.maximize();
		}
	}
}
