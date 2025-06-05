import { loadTranslations } from "./load-translations";

export const getOriginalTranslation = (path: string) => {
    const originalTranslations = loadTranslations().entries;

    return originalTranslations.find(previous => previous.path === path) ?? null;
}
