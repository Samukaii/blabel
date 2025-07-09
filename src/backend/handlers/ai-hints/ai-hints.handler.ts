import { ApplicationLanguagesService } from '../../services/languages/application-languages.service.js';
import { AiHintsService } from '../../services/ai-hints/ai-hints.service.js';
import { AvailableLanguageKey } from '@shared/models/available-languages.js';
import { AiHintsPayload } from '@shared/models/ai-hints-payload';
import { inject, Injectable } from '../../di/di';
import { aiIntegrationKey } from '../../core/open-ai-client';
import { ElectronFeatures } from '@shared/models/electron-features';

type Interface = ElectronFeatures['aiHints'];

@Injectable({providedIn: "root"})
export class AiHintsHandler implements Interface {
	private applicationLanguagesService = inject(ApplicationLanguagesService);
	private service = inject(AiHintsService);

	async translateEmptyLanguages(payload: AiHintsPayload) {
		const entries = payload.entries;

		const mainLanguage = (await this.applicationLanguagesService.getAll())[0];

		const mainLanguageValue = entries.find(entry => entry.language===mainLanguage.key)?.value;

		if (!mainLanguageValue)
			throw new Error(`The main language ${mainLanguage.name} was not filled`);

		const languagesToUse = entries.filter(entry => {
			if (!payload.onlyEmptyFields) return entry.language!==mainLanguage.key;

			return !entry.value && (entry.language!==mainLanguage.key);
		});
		const languagesToUseKeys = languagesToUse.map(entry => entry.language as AvailableLanguageKey);

		const result = await this.service.translate(mainLanguageValue, languagesToUseKeys, payload.additionalContext);

		return {result};
	};

	async hasIntegratedAi() {
		return !!aiIntegrationKey()
	}
}
