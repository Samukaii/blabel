import { TranslationOperation } from "./translation-operation.js";

export interface TranslationDiff {
	operation: TranslationOperation;
	entries: {
		path: string;
		languages: {
			label: string;
			oldValue: string | null;
			newValue: string | null;
		}[];
	}[];
}
