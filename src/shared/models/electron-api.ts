import { TranslationsHandler } from '@shared/models/handlers/translations-handler';
import { LanguagesHandler } from '@shared/models/handlers/languages-handler';
import { AiHintsHandler } from '@shared/models/handlers/ai-hints-handler';

export interface ElectronApi {
	translations: TranslationsHandler;
	languages: LanguagesHandler;
	aiHints: AiHintsHandler;
}
