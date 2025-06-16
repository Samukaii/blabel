import { fileManager } from "./file-manager.js";
export const jsonFileManager = (path) => {
    const manager = fileManager(path);
    const get = async () => {
        const file = await manager.get();
        return JSON.parse(file);
    };
    const save = async (content) => {
        await manager.save(JSON.stringify(content, null, 2));
    };
    return { get, save, exists: manager.exists };
};
