import { currentWindow } from 'backend/core/current-window';

const openDevTools = () => {
	const window = currentWindow.get();

	window.webContents.openDevTools({
		mode: 'detach',
	});
};

export const developmentHandlers = {openDevTools};
