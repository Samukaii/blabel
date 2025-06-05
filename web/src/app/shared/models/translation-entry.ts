import { TranslationLanguage } from "./translation-language";

export interface TranslationEntry {
    language: TranslationLanguage;
    value: string;
    status: 'idle' | 'edited';
}
