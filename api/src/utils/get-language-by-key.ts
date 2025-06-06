import { applicationConfigService } from "../core/services/application-config/application-config.service";
import { TranslationLanguage } from "../models/translation-language";

export const getLanguageByKey = (language: string) => {
    const registeredLanguages = applicationConfigService.getLanguages();

    const foundLanguage = registeredLanguages.find(registered => registered.key === language);

    if (!foundLanguage)
        throw new Error(`Language "${language}" not found`);

    return {
        key: foundLanguage.key,
        label: foundLanguage.label
    } as TranslationLanguage;
}
