import { promises as fs } from 'fs';
import { dirname } from 'path';
const cacheMap = new Map();
const pendingReads = new Map();
export const fileManager = (path) => {
    const exists = async () => {
        try {
            await fs.access(path);
            return true;
        }
        catch {
            return false;
        }
    };
    const get = async () => {
        const fileExists = await exists();
        if (!fileExists)
            throw new Error(`Arquivo não encontrado: ${path}`);
        if (pendingReads.has(path)) {
            return pendingReads.get(path);
        }
        const readPromise = (async () => {
            const stats = await fs.stat(path);
            const lastModified = stats.mtimeMs;
            const cache = cacheMap.get(path) ?? null;
            if (cache?.lastModified === lastModified) {
                pendingReads.delete(path);
                return cache.content;
            }
            const file = await fs.readFile(path, 'utf-8');
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
    const save = async (content) => {
        const dir = dirname(path);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path, content);
        await new Promise(r => setTimeout(r, 10));
        const stats = await fs.stat(path);
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
