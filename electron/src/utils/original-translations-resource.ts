import { loadTranslations } from "./load-translations.js";
import { AvailableLanguageKey } from "../models/available-languages.js";

export const originalTranslationsResource = async () => {
	const originalTranslations = await loadTranslations();

	const getTranslation = (path: string) =>
		originalTranslations.entries.find(previous => previous.path === path)
		?? null;

	const getEntry = (path: string, language: AvailableLanguageKey) =>
		getTranslation(path)?.entries.find(entry => entry.language.key === language) ?? null;

	return {
		getTranslation,
		getEntry
	}
}
