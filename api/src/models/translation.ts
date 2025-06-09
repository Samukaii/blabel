import { TranslationEntry } from "./translation-entry";
import { TranslationOperation } from "./translation-operation";

export interface Translation {
	id: string;
	path: string;
	operation: TranslationOperation;
	entries: TranslationEntry[];
}
