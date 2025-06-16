import { fileManager } from "./file-manager.js";
export const localJsonResource = (path) => {
    const manager = fileManager(path);
    let lastResult = null;
    const get = async () => {
        if (lastResult)
            return lastResult;
        const file = await manager.get();
        return JSON.parse(file);
    };
    const save = async (content) => {
        await manager.save(JSON.stringify(content, null, 2));
        lastResult = null;
    };
    const exists = async () => {
        if (!!lastResult)
            return true;
        return await manager.exists();
    };
    const update = async (fn) => {
        await save(fn(await get()));
    };
    return { get, save, update, exists };
};
