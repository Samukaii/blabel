import { AvailableLanguageKey } from './available-languages.js';

export interface TranslationChange {
	path: string;
	entries: {
		language: AvailableLanguageKey;
		value: string;
	}[];
}
