import { getOriginalTranslation } from "./get-original-translation";

export const getOriginalEntry = (path: string, language: string) => {
    const existent = getOriginalTranslation(path);

    if (!existent) return null;

    const entry = existent.entries.find(existentEntry => existentEntry.language.key === language);

    if (!entry)
        throw new Error(`Language "${language}" not found`);

    return entry;
}
