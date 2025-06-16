import { TranslationEntry } from "./translation-entry.js";
import { TranslationOperation } from "./translation-operation.js";

export interface Translation {
	id: string;
	path: string;
	operation: TranslationOperation;
	entries: TranslationEntry[];
}
