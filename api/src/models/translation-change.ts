import { AvailableLanguageKey } from './available-languages';

export interface TranslationChange {
	path: string;
	entries: {
		language: AvailableLanguageKey;
		value: string;
	}[];
}
