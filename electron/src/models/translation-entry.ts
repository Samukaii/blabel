import { TranslationLanguage } from "./translation-language.js";

export interface TranslationEntry {
	id: string;
	language: TranslationLanguage;
	value: string;
	originalValue: string;
	status: "idle" | "edited";
}
