import { loadTranslations } from "./load-translations.js";
export const originalTranslationsResource = async () => {
    const originalTranslations = await loadTranslations();
    const getTranslation = (path) => originalTranslations.entries.find(previous => previous.path === path)
        ?? null;
    const getEntry = (path, language) => getTranslation(path)?.entries.find(entry => entry.language.key === language) ?? null;
    return {
        getTranslation,
        getEntry
    };
};
