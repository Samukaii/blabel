import { inject, Injectable } from '../../di/di';
import { ApplicationLanguagesService } from '../languages/application-languages.service';
import { globalJsonResource } from '../../core/global-json-resource';
import path from 'path';
import { flattenTranslations } from '../../utils/flatten-translations';
import { Translation } from '@shared/models/translation';
import { AvailableLanguageKey } from '@shared/models/available-languages';


@Injectable({ providedIn: 'root' })
export class ApplicationLanguagesLoaderService {
	languagesService = inject(ApplicationLanguagesService);

	async saveTranslations(language: string, object: Record<string, any>) {
		const registeredLanguages = await this.languagesService.getAll();
		const translationFile = registeredLanguages.find(registeredLanguage => registeredLanguage.key === language);

		if (!translationFile)
			throw new Error(`Language "${language}" not found.`);

		await globalJsonResource(translationFile.path).save(object);
	};

	async loadTranslations() {
		const translationsByLang: Record<string, Record<string, string>> = {};
		const all = await this.getTranslations();

		for (const language in all) {
			const content = all[language];

			translationsByLang[language] = flattenTranslations(content);
		}

		const allPaths = new Set<string>();
		Object.values(translationsByLang).forEach(langMap => {
			Object.keys(langMap).forEach(key => allPaths.add(key));
		});

		const registeredLanguages = await this.languagesService.getAll();

		const merged: Translation[] = [];

		for (const pathKey of allPaths) {
			const entry: Translation = {id: pathKey, path: pathKey, entries: [], operation: 'none'};

			for (const [lang, langMap] of Object.entries(translationsByLang)) {
				const registeredLanguage = registeredLanguages.find(registered => registered.key === lang);

				if (!registeredLanguage) continue;

				entry.entries.push({
					id: `${pathKey}-${registeredLanguage.key}`,
					language: {
						key: registeredLanguage.key,
						name: registeredLanguage.name,
					},
					value: langMap[pathKey],
					originalValue: langMap[pathKey],
					status: 'idle'
				});
			}

			merged.push(entry);
		}

		const languages = registeredLanguages.map(registered => ({key: registered.key, name: registered.name}));

		return {languages, entries: merged};
	};

	async getTranslations() {
		const files = await this.languagesService.getAll();
		const translationsByLang: Record<string, Record<string, string>> = {};

		const reads = files.map(async file => {
			const filePath = path.resolve(file.path);
			const fileManager = globalJsonResource<Record<string, string>>(filePath);

			translationsByLang[file.key] = await fileManager.get();
		});

		await Promise.all(reads);

		return translationsByLang;
	};

	async originalTranslationsResource() {
		const originalTranslations = await this.loadTranslations();

		const getTranslation = (path: string) =>
			originalTranslations.entries.find(previous => previous.path === path)
			?? null;

		const getEntry = (path: string, language: AvailableLanguageKey) =>
			getTranslation(path)?.entries.find(entry => entry.language.key === language) ?? null;

		return {
			getTranslation,
			getEntry
		}
	}
}
