import { TranslationEntry } from "./translation-entry";

export interface Translation {
    id: string;
    path: string;
    operation: 'none' | 'edit' | 'create' | 'delete';
    entries: TranslationEntry[];
}
