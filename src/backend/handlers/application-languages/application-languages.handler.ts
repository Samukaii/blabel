import { AvailableLanguage, AvailableLanguageKey } from '@shared/models/available-languages';
import { AutocompleteOption } from '@shared/models/autocomplete-option';
import { api } from '../../core/api/api.js';
import { ApplicationLanguagesService } from '../../services/languages/application-languages.service.js';
import { inject, Injectable } from '../../di/di';
import { ElectronFeatures } from '@shared/models/electron-features';

type Interface = ElectronFeatures['languages'];

@Injectable({ providedIn: 'root' })
export class ApplicationLanguagesHandler implements Interface {
	private languagesService = inject(ApplicationLanguagesService);

	async get() {
		const results = await this.languagesService.getAll();
		return {
			results: results.sort((a, b) => a.name.localeCompare(b.name)),
		};
	}

	async add(language: { key: AvailableLanguageKey; path: string }) {
		await this.languagesService.add(language);
	}

	async remove(languageKey: AvailableLanguageKey) {
		await this.languagesService.remove(languageKey);
	}

	async update(languageKey: AvailableLanguageKey, languageUpdated: { path?: string }) {
		await this.languagesService.update(languageKey, languageUpdated);
	}

	async autocomplete(search: string) {
		const { data } = await api().get<{ results: AvailableLanguage[] }>('languages', {
			params: { search },
		});

		const options: AutocompleteOption[] = data.results.map((lang) => ({
			label: lang.name,
			value: lang.key,
		}));

		return { results: options };
	}
}
