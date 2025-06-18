import stripJsonComments from "strip-json-comments";
import { fileManager } from "./file-manager.js";

export const globalJsonResource = <T extends Record<string, any>>(path: string) => {
	const manager = fileManager(path);

	const get = async () => {
		const file = await manager.get();

		const withoutComments = stripJsonComments(file);

		return JSON.parse(withoutComments) as T;
	};

	const save = async (content: T) => {
		await manager.save(JSON.stringify(content, null, 2));
	};

	const update = async (fn: (content: T) => T) => {
		await save(fn(await get()));
	};

	return { get, save, update, exists: () => manager.exists() };
};
