import { TranslationLanguage } from "./translation-language";

export interface TranslationEntry {
	id: string;
	language: TranslationLanguage;
	value: string;
	originalValue: string;
	status: "idle" | "edited";
}
