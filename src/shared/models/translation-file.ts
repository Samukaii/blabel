import { AvailableLanguageKey } from '@shared/models/available-languages.js';

export interface TranslationFile {
	id: string;
	path: string;
	key: AvailableLanguageKey;
	label: string;
	isMain: boolean;
}
