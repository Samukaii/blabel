import { translationChangesService } from "../../services/changes/translation-changes.service.js";
import { applySearch } from "../../utils/apply-search.js";
import { getWithChanges } from "../../utils/get-with-changes.js";
import { loadTranslations } from "../../utils/load-translations.js";
import { TranslationChange } from "@shared/models/translation-change.js";
import { AvailableLanguageKey } from '@shared/models/available-languages.js';
import { TranslationsHandler } from '@shared/models/handlers/translations-handler.js';
import { TranslationDiff } from "@shared/models/translation-diff.js";

const getAll = async (options: {search: string}) => {
	const allChanges = await translationChangesService.get();

	const search = options.search;

	const files = await loadTranslations();

	const all = await getWithChanges(files.entries);

	const results = applySearch(all, search);

	return {
		changesCount: allChanges.length,
		languages: files.languages,
		results: results.slice(0, 25),
	};
};

const registerChange = async (change: TranslationChange) => {
	await translationChangesService.addChange(change);
};

const getAllChanges = async () => {
	const translations = await translationChangesService.get();

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
			(change) => change.operation === translation.operation
		);

		if (!existent) return;

		existent.entries.push({
			path: translation.path,
			languages: translation.entries.map((entry) => {
				if (translation.operation === "create")
					return {
						label: entry.language.label,
						oldValue: null,
						newValue: entry.value,
					};

				if (translation.operation === "delete")
					return {
						label: entry.language.label,
						oldValue: entry.originalValue,
						newValue: null,
					};

				if (entry.value === entry.originalValue) return;

				return {
					label: entry.language.label,
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

const revertEntryChange = async (path: string, language: AvailableLanguageKey) => {
	await translationChangesService.revertEntryChange(path, language);
};

const revertTranslationChange = async (path: string) => {
	await translationChangesService.revertTranslationChange(path);
};

const registerRemoveChange = async (path: string) => {
	await translationChangesService.registerRemoveChange(path);
};

const discardAllChanges = async () => {
	await translationChangesService.discardAllChanges();
};

const saveAll = async () => {
	await translationChangesService.saveAll();
};

export const translationsHandler: TranslationsHandler = {
	getAll,
	registerChange,
	getAllChanges,
	registerRemoveChange,
	discardAllChanges,
	revertEntryChange,
	revertTranslationChange,
	saveAll,
};
