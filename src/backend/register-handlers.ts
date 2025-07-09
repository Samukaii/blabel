import * as electron from 'electron';
import { classToPlainObject } from '@shared/utils/class-to-plain-object';
import { allHandlers } from './all-handlers';
import { inject } from './di/di';
import { isClass } from '@shared/utils/is-class';

const register = (obj: any, path: string[] = []) => {
	for (const key in obj) {
		const value = obj[key];
		const fullPath = [...path, key];

		if (isClass(value)) {
			const instance = inject(value);

			register(classToPlainObject(instance), fullPath);
		}
		else if (typeof value === 'function') {
			const channel = fullPath.join(':');

			electron.ipcMain.handle(channel, async (event, ...args) => {
				const boundFn = value.bind(obj);
				return await boundFn(...args)
			});
		}
		else if (typeof value === 'object' && value !== null) {
			register(value, fullPath);
		}
	}
};

export const registerHandlers = () => {
	register(allHandlers);
};

