import { applicationLanguagesService } from '../../services/languages/application-languages.service';
import { AvailableLanguage, AvailableLanguageKey } from '@shared/models/available-languages';
import { LanguagesHandler } from '@shared/models/handlers/languages-handler';
import { availableLanguages } from '@shared/constants/available-languages';
import { AutocompleteOption } from '@shared/models/autocomplete-option';

const get = async () => {
	const results = await applicationLanguagesService.getAll();

	return {results: results.sort((a, b) => a.label.localeCompare(b.label))};
}

const add = async (language: { key: AvailableLanguageKey; path: string; isMain: boolean }) => {
	await applicationLanguagesService.add(language);
}

const remove = async (languageKey: AvailableLanguageKey) => {
	await applicationLanguagesService.remove(languageKey);
}

const update = async (languageKey: AvailableLanguageKey, languageUpdated: { path?: string; isMain: boolean }) => {
	await applicationLanguagesService.update(languageKey, languageUpdated);
}

const autocomplete = async (search: string) => {
	let results = availableLanguages as AvailableLanguage[];

	if (search)
		results = availableLanguages.filter((lang) =>
			lang.label.toLowerCase().includes(search.toLowerCase()))

	const options = results.map((lang): AutocompleteOption => ({
		label: lang.label,
		value: lang.key
	}));

	return {results: options};
}

export const applicationLanguagesHandler: LanguagesHandler = {
	get,
	add,
	remove,
	update,
	autocomplete
};
