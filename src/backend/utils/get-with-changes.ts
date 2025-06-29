import { Translation } from "@shared/models/translation.js";
import { translationChangesService } from "../services/changes/translation-changes.service.js";

export const getWithChanges = async (translations: Translation[]) => {
	const allChanges = await translationChangesService.get();

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
