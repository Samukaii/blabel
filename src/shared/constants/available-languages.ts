import { AvailableLanguage } from "@shared/models/available-languages.js";

export const availableLanguages = [
	{
		key: "en-us",
		label: "Inglês"
	},
	{
		key: "es",
		label: "Espanhol"
	},
	{
		key: "ko",
		label: "Coreano"
	},
	{
		key: "pt-br",
		label: "Português"
	},
	{
		key: "zh-cn",
		label: "Mandarim"
	}
] as const satisfies AvailableLanguage[];
