import { applicationLanguagesService } from '../../services/languages/application-languages.service.js';
import { aiHintsService } from '../../services/ai-hints/ai-hints.service.js';
import { AvailableLanguageKey } from '@shared/models/available-languages.js';
import { AiHintsPayload } from '@shared/models/ai-hints-payload';
import { AiHintsHandler } from '@shared/models/handlers/ai-hints-handler';

const translateEmptyLanguages = async (payload: AiHintsPayload) => {
	const entries = payload.entries;

	const mainLanguage = await applicationLanguagesService.getMain();

	const mainLanguageValue = entries.find(entry => entry.language === mainLanguage.key)?.value;

	if (!mainLanguageValue)
		throw new Error(`The main language ${mainLanguage.label} was not filled`);

	const languagesToUse = entries.filter(entry => {
		if (!payload.onlyEmptyFields) return entry.language !== mainLanguage.key;

		return !entry.value && (entry.language !== mainLanguage.key);
	});
	const languagesToUseKeys = languagesToUse.map(entry => entry.language as AvailableLanguageKey);

	const result = await aiHintsService.translate(mainLanguageValue, languagesToUseKeys, payload.additionalContext);

	return {result};
};


export const aiHintsHandler: AiHintsHandler = {
	translateEmptyLanguages
};
