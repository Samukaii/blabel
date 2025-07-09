import { allLanguageKeys } from '@shared/constants/all-language-keys.js';

export type AvailableLanguageKey = (typeof allLanguageKeys)[number];

export interface AvailableLanguage {
	name: string;
	key: AvailableLanguageKey;
}
