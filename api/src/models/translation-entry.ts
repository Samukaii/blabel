import { TranslationLanguage } from "./translation-language";

export interface TranslationEntry {
    language: TranslationLanguage;
    value: string;
    edited: boolean;
}
