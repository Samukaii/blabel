export const allLanguageKeys = [
	'en-us',
	'es',
	'ko',
	'pt-br',
	'zh-cn',
] as const;

export type AvailableLanguageKey = (typeof allLanguageKeys)[number];

export interface AvailableLanguage {
	label: string;
	key: AvailableLanguageKey;
}

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


