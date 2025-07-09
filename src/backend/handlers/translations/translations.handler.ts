import { TranslationChangesService } from "../../services/changes/translation-changes.service.js";
import { applySearch } from "../../utils/apply-search.js";
import { TranslationChange } from "@shared/models/translation-change.js";
import { AvailableLanguageKey } from '@shared/models/available-languages.js';
import { TranslationDiff } from "@shared/models/translation-diff.js";
import { ElectronFeatures } from '@shared/models/electron-features';
import { TemporaryCache } from '../../decorators/temporary-cache';
import { inject, Injectable } from '../../di/di';
import { Translation } from '@shared/models/translation';
import {
	ApplicationLanguagesLoaderService
} from '../../services/languages-loader/application-languages-loader.service';

type Interface = ElectronFeatures['translations'];

@Injectable({providedIn: 'root'})
export class TranslationsHandler implements Interface {
	private translationChangesService = inject(TranslationChangesService);
	private languagesLoader = inject(ApplicationLanguagesLoaderService);

	@TemporaryCache()
	async getAll(options: { search: string }) {
		const allChanges = await this.translationChangesService.get();

		const search = options.search;

		const files = await this.languagesLoader.loadTranslations();

		const all = await this.getWithChanges(files.entries);

		const results = applySearch(all, search);

		return {
			changesCount: allChanges.length,
			languages: files.languages,
			results: results.slice(0, 25),
		};
	};

	@TemporaryCache()
	async registerChange(change: TranslationChange) {
		await this.translationChangesService.addChange(change);
	};

	@TemporaryCache()
	async getAllChanges() {
		const translations = await this.translationChangesService.get();

		const changes: TranslationDiff[] = [
			{
				operation: "create",
				entries: [],
			},
			{
				operation: "edit",
				entries: [],
			},
			{
				operation: "delete",
				entries: [],
			},
		];

		translations.forEach((translation) => {
			const existent = changes.find(
				(change) => change.operation===translation.operation
			);

			if (!existent) return;

			existent.entries.push({
				path: translation.path,
				languages: translation.entries.map((entry) => {
					if (translation.operation==="create")
						return {
							name: entry.language.name,
							oldValue: null,
							newValue: entry.value,
						};

					if (translation.operation==="delete")
						return {
							name: entry.language.name,
							oldValue: entry.originalValue,
							newValue: null,
						};

					if (entry.value===entry.originalValue) return;

					return {
						name: entry.language.name,
						oldValue: entry.originalValue,
						newValue: entry.value,
					};
				}).filter(entry => !!entry),
			});
		});

		return {
			results: changes,
		};
	};

	@TemporaryCache()
	async revertEntryChange(path: string, language: AvailableLanguageKey) {
		await this.translationChangesService.revertEntryChange(path, language);
	};

	@TemporaryCache()
	async revertTranslationChange(path: string) {
		await this.translationChangesService.revertTranslationChange(path);
	};

	@TemporaryCache()
	async registerRemoveChange(path: string) {
		await this.translationChangesService.registerRemoveChange(path);
	};

	@TemporaryCache()
	async discardAllChanges() {
		await this.translationChangesService.discardAllChanges();
	};

	@TemporaryCache()
	async saveAll() {
		await this.translationChangesService.saveAll();
	};

	private async getWithChanges(translations: Translation[]) {
		const allChanges = await this.translationChangesService.get();

		const newChanges = allChanges.filter(change => !translations.some(entry => change.path === entry.path));
		const remapped = translations.filter(result => !newChanges.some(change => change.path === result.path)).map(entry => {
			const existentChange = allChanges.find(change => change.path === entry.path);

			if (existentChange) return existentChange;

			return entry;
		});

		return [
			...newChanges,
			...remapped
		];
	}

}
