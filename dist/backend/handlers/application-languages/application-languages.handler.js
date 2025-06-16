import { applicationLanguagesService } from '../../services/languages/application-languages.service.js';
import { availableLanguages } from '../../../shared/constants/available-languages.js';
const get = async () => {
    const results = await applicationLanguagesService.getAll();
    return { results: results.sort((a, b) => a.label.localeCompare(b.label)) };
};
const add = async (language) => {
    await applicationLanguagesService.add(language);
};
const remove = async (languageKey) => {
    await applicationLanguagesService.remove(languageKey);
};
const update = async (languageKey, languageUpdated) => {
    await applicationLanguagesService.update(languageKey, languageUpdated);
};
const autocomplete = async (search) => {
    let results = availableLanguages;
    if (search)
        results = availableLanguages.filter((lang) => lang.label.toLowerCase().includes(search.toLowerCase()));
    const options = results.map((lang) => ({
        label: lang.label,
        value: lang.key
    }));
    return { results: options };
};
export const applicationLanguagesHandler = {
    get,
    add,
    remove,
    update,
    autocomplete
};
