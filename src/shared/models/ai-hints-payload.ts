import { AvailableLanguageKey } from "@shared/models/available-languages";

export interface AiHintsPayload {
	additionalContext: string;
	onlyEmptyFields: boolean;
	entries: {
		language: AvailableLanguageKey;
		value: string;
	}[];
}
