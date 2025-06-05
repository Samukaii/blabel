import { Translation } from "../models/translation";
import { flattenTranslations } from "./flatten-translations";
import { getTranslations } from './get-translations';
import { translationFilesLoader } from "./translation-files-loader";


export const loadTranslations = () => {
  const translationsByLang: Record<string, Record<string, string>> = {};
  const all = getTranslations();

  for (const language in all) {
    const content = all[language];

    translationsByLang[language] = flattenTranslations(content);
  }

  const allPaths = new Set<string>();
  Object.values(translationsByLang).forEach(langMap => {
    Object.keys(langMap).forEach(key => allPaths.add(key));
  });

  const registeredLanguages = translationFilesLoader.get();

  const merged: Translation[] = [];

  for (const pathKey of allPaths) {
    const entry: Translation = { path: pathKey, entries: [], operation: 'none' };

    for (const [lang, langMap] of Object.entries(translationsByLang)) {
      const registeredLanguage = registeredLanguages.find(registered => registered.language === lang);

      if (!registeredLanguage) continue;

      entry.entries.push({
        language: {
          key: registeredLanguage.language,
          label: registeredLanguage.label,
        },
        value: langMap[pathKey],
        status: 'idle'
      });
    }

    merged.push(entry);
  }

  const languages = registeredLanguages.map(registered => ({ key: registered.language, label: registered.label }));

  return { languages, entries: merged };
};
