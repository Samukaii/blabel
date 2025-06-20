import { AvailableLanguageKey } from '@shared/models/available-languages.js';
import { TranslationChange } from '@shared/models/translation-change';
import { TranslationEntry } from '@shared/models/translation-entry';
import { Translation } from "@shared/models/translation.js";
import { localJsonResource } from '../../core/local-json-resource.js';
import { getTranslations } from "../../utils/get-translations.js";
import { groupByLanguage } from "../../utils/group-by-language.js";
import { originalTranslationsResource } from "../../utils/original-translations-resource.js";
import { removePathFromObject } from "../../utils/remove-path-from-object.js";
import { saveTranslations } from "../../utils/save-translations.js";
import { updateOrCreateTranslation } from "../../utils/update-or-create-translation.js";
import { applicationLanguagesService } from '../languages/application-languages.service.js';


const getResource = () => localJsonResource<Translation[]>(
	"data/translation-changes.json"
);

const get = async () => {
	const exists = await getResource().exists();

	if (!exists) return [];

	return await getResource().get()
};

const save = async (changes: Translation[]) => {
	await getResource().save(changes);
};

const updateOne = async (path: string, value: Partial<Translation>) => {
	await getResource().update(all => {
		return all.map(translation => {
			if (translation.path !== path) return translation;

			return {
				...translation,
				...value
			}
		});
	});
};

const add = async (translation: Translation) => {
	await getResource().update(all => [
		...all,
		translation
	]);
}


const addChange = async (change: TranslationChange) => {
	const resource = await originalTranslationsResource();

	const existent = resource.getTranslation(change.path);
	const allChanges = await get();

	const allLanguages = await applicationLanguagesService.getAllSortedByMain();
	const getLanguageByKey = (key: AvailableLanguageKey) =>
		allLanguages.find(registered => registered.key === key);

	if (!existent) {
		const alreadyRegistered = allChanges.find(
			(registered) => registered.path === change.path
		);

		if (alreadyRegistered) {
			await updateOne(change.path, {
					id: change.path,
					path: change.path,
					operation: "create",
					entries: change.entries.map((entry) => ({
						id: `${change.path}-${entry.language}`,
						status: "idle",
						language: getLanguageByKey(entry.language)!,
						originalValue: entry.value,
						value: entry.value,
					})),
				}
			);
			return;
		}

		await add(
			{
				id: change.path,
				path: change.path,
				operation: "create",
				entries: change.entries.map((entry) => ({
					id: `${change.path}-${entry.language}`,
					status: "idle",
					language: getLanguageByKey(entry.language)!,
					originalValue: entry.value,
					value: entry.value,
				})),
			},
		);

		return;
	}

	const updated: Translation = {
		operation: "edit",
		id: change.path,
		path: change.path,
		entries: change.entries.map((entry): TranslationEntry => {
			const originalEntry = existent.entries.find(existentEntry => existentEntry.language.key === entry.language)!;

			return {
				id: `${change.path}-${entry.language}`,
				language: getLanguageByKey(entry.language)!,
				value: entry.value,
				originalValue: originalEntry.value,
				status: entry.value !== originalEntry.value ? "edited" : "idle",
			};
		}),
	};

	const hasChanges = updated.entries.some((entry) => entry.status);

	if (!hasChanges) {
		await save(
			allChanges.filter((existentChange) => existentChange.path !== change.path)
		);
		return;
	}

	await save(
		allChanges.map((existentChange) => {
			if (existentChange.path === change.path) return updated;

			return existentChange;
		})
	);

	if (!allChanges.find((existentChange) => existentChange.path === change.path))
		await save([...allChanges, updated]);
};

const revertEntryChange = async (path: string, language: string) => {
	let allChanges = await get();

	allChanges = allChanges.map((change) => {
		if (change.path !== path) return change;

		return {
			...change,
			entries: change.entries.map((entry) => {
				if (entry.language.key !== language) return entry;

				return {
					...entry,
					status: 'idle',
					value: entry.originalValue
				}
			}),
		};
	});

	allChanges = allChanges.filter((change) => {
		if (change.operation !== "none" && change.operation !== "edit") return true;

		return change.entries.some((entry) => entry.status === "edited");
	});

	await save(allChanges);
};

const revertTranslationChange = async (path: string) => {
	const allChanges = await get();

	await save(allChanges.filter((change) => change.path !== path));
};

const registerRemoveChange = async (path: string) => {
	const allChanges = await get();
	const resource = await originalTranslationsResource();

	const existent = allChanges.find((change) => change.path === path);

	if (!existent) {
		const originalTranslation = resource.getTranslation(path);

		if (!originalTranslation)
			throw new Error(`Translation with path ${path} not found`);

		await save([
			...allChanges,
			{
				...originalTranslation,
				operation: "delete",
			},
		]);

		return;
	}

	if (existent.operation === "create") {
		await revertTranslationChange(path);
		return;
	}

	await save(
		allChanges.map((change) => {
			if (change.path !== path) return change;

			return {
				...change,
				operation: "delete",
				entries: change.entries.map((entry) => ({
					...entry,
					status: "idle",
				})),
			};
		})
	);
};

const discardAllChanges = async () => {
	await save([]);
};

const saveAll = async () => {
	const changes = await get();

	const files = await getTranslations();

	const grouped = groupByLanguage(changes);

	grouped.forEach((change) => {
		const obj = files[change.language];

		change.values.forEach((value) => {
			if (value.operation === "create" || value.operation === "edit")
				updateOrCreateTranslation(obj, {
					path: value.path,
					value: value.entry.value,
				});

			if (value.operation === "delete") removePathFromObject(obj, value.path);
		});

		saveTranslations(change.language, obj);
	});

	await discardAllChanges();
};

export const translationChangesService = {
	addChange,
	revertEntryChange,
	revertTranslationChange,
	registerRemoveChange,
	discardAllChanges,
	saveAll,
	get,
};
