import { fileManager } from "./file-manager.js";

export const localJsonResource = <T extends (Record<string, any> | Record<string, any>[])>(path: string) => {
	const manager = fileManager(path);
	let lastResult: T | null = null;

	const get = async () => {
		if (lastResult) return lastResult;

		const file = await manager.get();

		return JSON.parse(file) as T;
	};

	const save = async (content: T) => {
		await manager.save(JSON.stringify(content, null, 2));
		lastResult = null;
	};

	const exists = async () => {
		if (!!lastResult) return true;

		return await manager.exists();
	}

	const update = async (fn: (content: T) => T) => {
		await save(fn(await get()));
	}

	return {get, save, update, exists};
};
