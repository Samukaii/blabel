import { Translation } from "../models/translation.js";
import { TranslationEntry } from "../models/translation-entry.js";

export const groupByLanguage = (translations: Translation[]) => {
	const grouped: {
		language: string;
		values: { path: string; operation: Translation['operation']; entry: TranslationEntry }[]
	}[] = [];

	translations.forEach(translation => {
		translation.entries.forEach(entry => {
			const existentLanguage = grouped.find(item => item.language === entry.language.key);

			if (translation.operation === 'none') return;

			if (existentLanguage)
				existentLanguage.values.push({
					entry,
					operation: translation.operation,
					path: translation.path
				});
			else grouped.push({
				language: entry.language.key,
				values: [{
					operation: translation.operation,
					path: translation.path,
					entry
				}]
			});
		})
	});

	return grouped;
}
