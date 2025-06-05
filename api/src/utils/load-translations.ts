import fs from "fs";
import path from "path";
import { Translation } from "../models/translation";
import { flattenTranslations } from "./flatten-translations";
import { translationFilesLoader } from "./translation-files-loader";

export const getTranslations = () => {
  const files = translationFilesLoader.get();
  const translationsByLang: Record<string, Record<string, string>> = {};

  files.forEach(file => {
    const filePath = path.resolve(file.path);
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);

    translationsByLang[file.language] = parsed;
  })

  return translationsByLang;
}


export const saveTranslations = (language: string, object: Record<string, any>) => {
  const rootDir = 'C:\\ambev\\splan\\frontend\\projects\\cosmic-ui\\src\\assets\\i18n';
  const filePath = `${rootDir}\\${language}.json`;

  fs.writeFileSync(filePath, JSON.stringify(object, null, 2));
}


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
