import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { FileCache } from '../models/file-cache.js';

const cacheMap = new Map<string, FileCache>();
const pendingReads = new Map<string, Promise<string>>();

export const fileManager = (path: string) => {
	const getPath = () => join(...path.split('/'));

	const exists = async () => {
		try {
			await fs.access(getPath());
			return true;
		} catch {
			return false;
		}
	};

	const get = async () => {
		const fileExists = await exists();
		if (!fileExists) throw new Error(`Arquivo não encontrado: ${path}`);

		if (pendingReads.has(path)) {
			return pendingReads.get(path)!;
		}

		const readPromise = (async () => {
			const stats = await fs.stat(getPath());
			const lastModified = stats.mtimeMs;
			const cache = cacheMap.get(path) ?? null;

			if (cache?.lastModified === lastModified) {
				pendingReads.delete(path);
				return cache.content;
			}

			const file = await fs.readFile(getPath(), 'utf-8');

			cacheMap.set(path, {
				content: file,
				lastModified,
			});

			pendingReads.delete(path);
			return file;
		})();

		pendingReads.set(path, readPromise);

		return readPromise;
	};

	const save = async (content: string) => {
		const dir = dirname(getPath());
		await fs.mkdir(dir, { recursive: true });
		await fs.writeFile(getPath(), content);

		await new Promise(r => setTimeout(r, 10));

		const stats = await fs.stat(getPath());
		const lastModified = stats.mtimeMs;

		cacheMap.set(path, {
			content,
			lastModified,
		});

		pendingReads.delete(path);
	};

	const invalidate = () => {
		cacheMap.delete(path);
		pendingReads.delete(path);
	};

	return { get, save, exists, invalidate };
};
