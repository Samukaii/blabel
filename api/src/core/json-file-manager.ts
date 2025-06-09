import { fileManager } from "./file-manager";

export const jsonFileManager = <T extends Record<string, any>>(path: string) => {
	const manager = fileManager(path);

	const get = async () => {
		const file = await manager.get();

		return JSON.parse(file) as T;
	};

	const save = async (content: T) => {
		await manager.save(JSON.stringify(content, null, 2));
	};

	return {get, save, exists: manager.exists};
};
