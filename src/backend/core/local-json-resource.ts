import { fileManager } from './file-manager.js';
import * as electron from 'electron';
import stripJsonComments from 'strip-json-comments';


export const localJsonResource = <
	T extends Record<string, any> | Record<string, any>[],
>(
	path: string,
) => {
	const manager = fileManager(`${electron.app.getPath('userData')}/${path}`);
	let lastResult: T | null = null;

	const get = async () => {
		if (lastResult) return lastResult;

		const file = await manager.get();
		const withoutComments = stripJsonComments(file);

		return JSON.parse(withoutComments) as T;
	};

	const save = async (content: T) => {
		await manager.save(JSON.stringify(content, null, 2));
		lastResult = null;
	};

	const exists = async () => {
		if (!!lastResult) return true;

		return await manager.exists();
	};

	const update = async (fn: (content: T) => T) => {
		await save(fn(await get()));
	};

	return { get, save, update, exists };
};
