import { AvailableLanguageKey } from '@shared/models/available-languages.js';
import { TranslationChange } from '@shared/models/translation-change';
import { Translation } from "@shared/models/translation.js";
import { localJsonResource } from '../../core/local-json-resource.js';
import { groupByLanguage } from "../../utils/group-by-language.js";
import { removePathFromObject } from "../../utils/remove-path-from-object.js";
import { updateOrCreateTranslation } from "../../utils/update-or-create-translation.js";
import { inject, Injectable } from 'backend/di/di.js';
import { ApplicationLanguagesService } from '../languages/application-languages.service';
import { ApplicationLanguagesLoaderService } from '../languages-loader/application-languages-loader.service';

@Injectable({ providedIn: 'root' })
export class TranslationChangesService {
	private applicationLanguagesService = inject(ApplicationLanguagesService);
	private applicationLanguagesLoaderService = inject(ApplicationLanguagesLoaderService);

	private resource?: ReturnType<typeof localJsonResource<Translation[]>>;

	getResource() {
		if(!this.resource)
			this.resource = localJsonResource<Translation[]>("data/translation-changes.json");

		return this.resource;
	}

	async get(): Promise<Translation[]> {
		const exists = await this.getResource().exists();
		return exists ? await this.getResource().get() : [];
	}

	async save(changes: Translation[]) {
		await this.getResource().save(changes);
	}

	async updateOne(path: string, value: Partial<Translation>) {
		await this.getResource().update(all =>
			all.map(translation =>
				translation.path === path ? { ...translation, ...value } : translation
			)
		);
	}

	async add(translation: Translation) {
		await this.getResource().update(all => [...all, translation]);
	}

	async addChange(change: TranslationChange) {
		const resource = await this.applicationLanguagesLoaderService.originalTranslationsResource();
		const existent = resource.getTranslation(change.path);
		const allChanges = await this.get();
		const allLanguages = await this.applicationLanguagesService.getAll();

		const getLanguageByKey = (key: AvailableLanguageKey) =>
			allLanguages.find(l => l.key === key)!;

		if (!existent) {
			const alreadyRegistered = allChanges.find(c => c.path === change.path);

			const newEntry: Translation = {
				id: change.path,
				path: change.path,
				operation: "create",
				entries: change.entries.map(entry => ({
					id: `${change.path}-${entry.language}`,
					status: "idle",
					language: getLanguageByKey(entry.language),
					originalValue: entry.value,
					value: entry.value,
				})),
			};

			alreadyRegistered
				? await this.updateOne(change.path, newEntry)
				: await this.add(newEntry);

			return;
		}

		const updated: Translation = {
			id: change.path,
			path: change.path,
			operation: "edit",
			entries: change.entries.map(entry => {
				const original = existent.entries.find(e => e.language.key === entry.language)!;
				return {
					id: `${change.path}-${entry.language}`,
					language: getLanguageByKey(entry.language),
					value: entry.value,
					originalValue: original.value,
					status: entry.value !== original.value ? "edited" : "idle",
				};
			}),
		};

		const hasChanges = updated.entries.some(e => e.status === "edited");

		if (!hasChanges) {
			await this.save(allChanges.filter(c => c.path !== change.path));
			return;
		}

		const updatedList = allChanges.map(c => (c.path === change.path ? updated : c));
		const isNew = !allChanges.find(c => c.path === change.path);

		await this.save(isNew ? [...updatedList, updated] : updatedList);
	}

	async revertEntryChange(path: string, language: string) {
		let allChanges = await this.get();

		allChanges = allChanges.map(change =>
			change.path !== path
				? change
				: {
					...change,
					entries: change.entries.map(entry =>
						entry.language.key !== language
							? entry
							: {
								...entry,
								status: "idle",
								value: entry.originalValue,
							}
					),
				}
		);

		allChanges = allChanges.filter(change =>
			change.operation !== "none" && change.operation !== "edit"
				? true
				: change.entries.some(e => e.status === "edited")
		);

		await this.save(allChanges);
	}

	async revertTranslationChange(path: string) {
		const allChanges = await this.get();
		await this.save(allChanges.filter(change => change.path !== path));
	}

	async registerRemoveChange(path: string) {
		const allChanges = await this.get();
		const resource = await this.applicationLanguagesLoaderService.originalTranslationsResource();

		const existent = allChanges.find(change => change.path === path);

		if (!existent) {
			const original = resource.getTranslation(path);
			if (!original) throw new Error(`Translation with path ${path} not found`);

			await this.save([
				...allChanges,
				{
					...original,
					operation: "delete",
				},
			]);
			return;
		}

		if (existent.operation === "create") {
			await this.revertTranslationChange(path);
			return;
		}

		await this.save(
			allChanges.map(change =>
				change.path !== path
					? change
					: {
						...change,
						operation: "delete",
						entries: change.entries.map(entry => ({
							...entry,
							status: "idle",
						})),
					} as Translation
			)
		);
	}

	async discardAllChanges() {
		await this.save([]);
	}

	async saveAll() {
		const changes = await this.get();
		const files = await this.applicationLanguagesLoaderService.getTranslations();
		const grouped = groupByLanguage(changes);

		grouped.forEach(change => {
			const obj = files[change.language];
			change.values.forEach(value => {
				if (value.operation === "create" || value.operation === "edit") {
					updateOrCreateTranslation(obj, {
						path: value.path,
						value: value.entry.value,
					});
				}
				if (value.operation === "delete") {
					removePathFromObject(obj, value.path);
				}
			});

			this.applicationLanguagesLoaderService.saveTranslations(change.language, obj);
		});

		await this.discardAllChanges();
	}
}
