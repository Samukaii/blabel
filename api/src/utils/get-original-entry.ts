import { getOriginalTranslation } from "./get-original-translation";

export const getOriginalEntry = (path: string, language: string) => {
    const existent = getOriginalTranslation(path);

    if (!existent) return null;

    return existent.entries.find(existentEntry => existentEntry.language.key === language);
}
