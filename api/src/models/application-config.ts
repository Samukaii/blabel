import { AvailableLanguage } from "./available-languages";
import { TranslationFile } from "./translation-file";

export interface ApplicationConfig {
    mainLanguage: AvailableLanguage;
    languageFiles: TranslationFile[];
}