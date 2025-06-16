import { Translation } from "../translation";
import { TranslationChange } from "../translation-change";
import { AvailableLanguageKey } from '@shared/models/available-languages.js';
import { TranslationDiff } from '@shared/models/translation-diff';

export interface TranslationsHandler {
	getAll: (options: { search: string }) => Promise<{
		changesCount: any;
		languages: {
			key: AvailableLanguageKey;
			label: string;
		}[];
		results: Translation[];
	}>;
	registerChange: (change: TranslationChange) => Promise<void>;
	getAllChanges: () => Promise<{ results: TranslationDiff[] }>;
	revertEntryChange: (path: string, language: AvailableLanguageKey) => Promise<void>;
	revertTranslationChange: (path: string) => Promise<void>;
	registerRemoveChange: (path: string) => Promise<void>;
	discardAllChanges: () => Promise<void>;
	saveAll: () => Promise<void>;
}
