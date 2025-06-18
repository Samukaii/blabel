import * as electron from 'electron';

export const registerHandlers = (obj: any, path: string[] = []) => {
	for (const key in obj) {
		const value = obj[key];
		const fullPath = [...path, key];

		if (typeof value === 'function') {
			const channel = fullPath.join(':');
			electron.ipcMain.handle(channel, async (event, ...args) => {
				return await value(...args);
			});
		} else if (typeof value === 'object' && value !== null) {
			registerHandlers(value, fullPath);
		}
	}
};
