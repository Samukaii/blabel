import { TranslationEntry } from "./translation-entry";

export interface Translation {
    path: string;
    isNew: boolean;
    entries: TranslationEntry[];
}
