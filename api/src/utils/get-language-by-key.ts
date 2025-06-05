import { TranslationLanguage } from "../models/translation-language";
import { translationFilesLoader } from "./translation-files-loader";

export const getLanguageByKey = (language: string) => {
    const all = translationFilesLoader.get();

    const foundLanguage = all.find(registered => registered.language === language);

    if (!foundLanguage)
        throw new Error(`Language "${language}" not found`);

    return {
        key: foundLanguage.language,
        label: foundLanguage.label
    } as TranslationLanguage;
}
