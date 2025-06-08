import { applicationConfigService } from "../core/services/application-config/application-config.service";
import { Translation } from "../models/translation";
import { flattenTranslations } from "./flatten-translations";
import { getTranslations } from './get-translations';


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

  const registeredLanguages = applicationConfigService.getLanguages();

  const merged: Translation[] = [];

  for (const pathKey of allPaths) {
    const entry: Translation = {id: pathKey, path: pathKey, entries: [], operation: 'none' };

    for (const [lang, langMap] of Object.entries(translationsByLang)) {
      const registeredLanguage = registeredLanguages.find(registered => registered.key === lang);

      if (!registeredLanguage) continue;

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
