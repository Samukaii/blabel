import { TranslationEntry } from "./translation-entry";

export interface Translation {
    path: string;
    operation: 'none' | 'edit' | 'create' | 'delete';
    entries: TranslationEntry[];
}
