import { AvailableLanguage } from "@shared/models/available-languages.js";

export const availableLanguages = [
	{
		key: "en-us",
		name: "Inglês"
	},
	{
		key: "es",
		name: "Espanhol"
	},
	{
		key: "ko",
		name: "Coreano"
	},
	{
		key: "pt-br",
		name: "Português"
	},
	{
		key: "zh-cn",
		name: "Mandarim"
	}
] as const satisfies AvailableLanguage[];
