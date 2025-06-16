import { AvailableLanguageKey } from '@shared/models/available-languages.js';
import { TranslationFile } from '@shared/models/translation-file';
import { AutocompleteOption } from '@shared/models/autocomplete-option';

export interface LanguagesHandler {
	get: () => Promise<{
		results: TranslationFile[];
	}>;
	autocomplete: (search: string) => Promise<{
		results: AutocompleteOption[];
	}>;
	add: (language: { key: AvailableLanguageKey; path: string; isMain: boolean }) => Promise<void>;
	remove: (languageKey: AvailableLanguageKey) => Promise<void>;
	update: (languageKey: AvailableLanguageKey, languageUpdated: { path?: string; isMain: boolean }) => Promise<void>;
}
