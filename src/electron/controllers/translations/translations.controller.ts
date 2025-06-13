import { RequestHandler } from "express";
import { TranslationChange } from "../../models/translation-change.js";
import { translationChangesService } from "../../services/changes/translation-changes.service.js";
import { applySearch } from "../../utils/apply-search.js";
import { getWithChanges } from "../../utils/get-with-changes.js";
import { loadTranslations } from "../../utils/load-translations.js";
import { TranslationDiff } from "../../models/translation-diff.js";

const getAll: RequestHandler = async (req, res) => {
	const {query} = req;

	const allChanges = await translationChangesService.get();

	const search = (query.search as string) ?? "";

	const files = await loadTranslations();

	const all = await getWithChanges(files.entries);

	const results = applySearch(all, search);

	res.json({
		changesCount: allChanges.length,
		languages: files.languages,
		results: results.slice(0, 25),
	});
};

const registerChange: RequestHandler = async (req, res) => {
	const {body} = req;

	const change = body.translation as TranslationChange;

	await translationChangesService.addChange(change);

	res.json({});
};

const getAllChanges: RequestHandler = async (_, res) => {
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

	res.json({
		results: changes,
	});
};

const revertEntryChange: RequestHandler = async (req, res) => {
	const {params} = req;

	const path = params.path;
	const language = params.language;

	await translationChangesService.revertEntryChange(path, language);

	res.json({});
};

const revertTranslationChange: RequestHandler = async (req, res) => {
	const {params} = req;

	const path = params.path;

	await translationChangesService.revertTranslationChange(path);

	res.json({});
};

const registerRemoveChange: RequestHandler = async (req, res) => {
	const {params} = req;

	const path = params.path as string;

	await translationChangesService.registerRemoveChange(path);

	res.json({});
};

const discardAllChanges: RequestHandler = async (_, res) => {
	await translationChangesService.discardAllChanges();

	res.json({});
};

const saveAll: RequestHandler = async (_, res) => {
	await translationChangesService.saveAll();

	res.json({});
};

export const translationsController = {
	getAll,
	registerChange,
	getAllChanges,
	registerRemoveChange,
	discardAllChanges,
	revertEntryChange,
	revertTranslationChange,
	saveAll,
};
