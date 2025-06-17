import { currentWindow } from 'backend/core/current-window';
import * as electron from 'electron';


const isProduction = async () => {
	return electron.app.isPackaged;
};

const isDebugAllowed = async () => {
	return !(await isProduction());
}

const openDevTools = async () => {
	const window = currentWindow.get();

	const debugAllowed = await isDebugAllowed();

	if(!debugAllowed) return;

	window.webContents.openDevTools({
		mode: 'detach',
	});
};

export const developmentHandler = {openDevTools, isProduction, isDebugAllowed};
