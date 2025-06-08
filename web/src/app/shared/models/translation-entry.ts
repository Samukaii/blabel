import { TranslationLanguage } from "./translation-language";

export interface TranslationEntry {
    id: string;
    language: TranslationLanguage;
    value: string;
    status: 'idle' | 'edited';
}
