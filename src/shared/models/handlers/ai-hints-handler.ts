import { AvailableLanguageKey } from '@shared/models/available-languages.js';
import { AiHintsPayload } from '@shared/models/ai-hints-payload';

export interface AiHintsHandler {
	translateEmptyLanguages: (payload: AiHintsPayload) => Promise<{
		result: Record<AvailableLanguageKey, string>;
	}>;
}
