import { AvailableLanguageKey } from '@shared/models/available-languages.js';
import { availableLanguages } from '@shared/constants/available-languages.js';
import { TranslationFile } from '@shared/models/translation-file';
import { applicationConfigService } from '../../core/services/application-config/application-config.service.js';
import { currentProject } from '../../core/current-project.js';
import { api } from '../../core/api/api.js';
import { Injectable } from 'backend/di/di.js';

@Injectable({ providedIn: 'root' })
export class ApplicationLanguagesService {
	async getAll(): Promise<TranslationFile[]> {
		const currentProjectId = currentProject.get();

		if (!currentProjectId)
			throw new Error('Nenhum projeto selecionado');

		const { data } = await api().get<{ results: TranslationFile[] }>(
			`projects/${currentProjectId}/languages`
		);

		return data.results.map((language): TranslationFile => ({
			name: language.name,
			key: language.key,
			path: `/mnt/c/Users/samue/Downloads/languages/${language.path}`,
			id: language.id,
		}));
	}

	async getOne(key: AvailableLanguageKey): Promise<TranslationFile | undefined> {
		const languageFiles = await this.getAll();
		return languageFiles.find(lang => lang.key === key);
	}

	private async createValidLanguage(language: {
		path: string;
		key: AvailableLanguageKey;
	}): Promise<TranslationFile> {
		const validLanguage = availableLanguages.find(l => l.key === language.key);

		if (!validLanguage)
			throw new Error(`Language ${language.key} is not a valid language`);

		return {
			id: `${language.path}-${language.key}`,
			...validLanguage,
			...language,
		};
	}

	async add(language: { path: string; key: AvailableLanguageKey }): Promise<void> {
		const isRegistered = await this.getOne(language.key);

		if (isRegistered)
			throw new Error(`Language ${language.key} is already registered`);

		const created = await this.createValidLanguage(language);
		const registeredLanguages = [created, ...(await this.getAll())];

		await applicationConfigService.update(config => ({
			...config,
			languageFiles: registeredLanguages,
		}));
	}

	async remove(languageKey: AvailableLanguageKey): Promise<void> {
		await applicationConfigService.update(config => ({
			...config,
			languageFiles: config.languageFiles.filter(l => l.key !== languageKey),
		}));
	}

	async update(
		key: AvailableLanguageKey,
		language: { path?: string }
	): Promise<void> {
		const registeredLanguage = await this.getOne(key);
		if (!registeredLanguage)
			throw new Error(`Language "${key}" is not registered`);

		const updatedLanguages = (await this.getAll()).map(l =>
			l.key !== key ? l : { ...l, ...language }
		);

		await applicationConfigService.update(config => ({
			...config,
			languageFiles: updatedLanguages,
		}));
	}
}
