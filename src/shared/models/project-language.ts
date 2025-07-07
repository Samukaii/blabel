import { AvailableLanguageKey } from '@shared/models/available-languages';

export interface ProjectLanguage {
	id: string;
	name: string;
	key: AvailableLanguageKey;
	path: string;
}
