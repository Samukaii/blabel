import { flattenTranslations } from "./flatten-translations.js";
import { getTranslations } from './get-translations.js';
import { applicationLanguagesService } from '../services/languages/application-languages.service.js';
export const loadTranslations = async () => {
    const translationsByLang = {};
    const all = await getTranslations();
    for (const language in all) {
        const content = all[language];
        translationsByLang[language] = flattenTranslations(content);
    }
    const allPaths = new Set();
    Object.values(translationsByLang).forEach(langMap => {
        Object.keys(langMap).forEach(key => allPaths.add(key));
    });
    const registeredLanguages = await applicationLanguagesService.getAllSortedByMain();
    const merged = [];
    for (const pathKey of allPaths) {
        const entry = { id: pathKey, path: pathKey, entries: [], operation: 'none' };
        for (const [lang, langMap] of Object.entries(translationsByLang)) {
            const registeredLanguage = registeredLanguages.find(registered => registered.key === lang);
            if (!registeredLanguage)
                continue;
            entry.entries.push({
                id: `${pathKey}-${registeredLanguage.key}`,
                language: {
                    key: registeredLanguage.key,
                    label: registeredLanguage.label,
                },
                value: langMap[pathKey],
                originalValue: langMap[pathKey],
                status: 'idle'
            });
        }
        merged.push(entry);
    }
    const languages = registeredLanguages.map(registered => ({ key: registered.key, label: registered.label }));
    return { languages, entries: merged };
};
