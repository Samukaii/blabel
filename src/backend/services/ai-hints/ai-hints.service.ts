import { openAiService } from '../../core/services/openai/openai.service.js';
import { z, infer as zodInfer } from "zod";
import { AvailableLanguage, AvailableLanguageKey } from '@shared/models/available-languages.js';
import { availableLanguages } from '@shared/constants/available-languages.js';

const getLanguagesText = (languages: AvailableLanguage[]) => {
	return languages.map(language => `- ${language.label} (chave: ${language.key})`).join('\n');
}

const getTranslationExample = (languages: AvailableLanguage[]) => {
	const object: Record<string, string> = {};

	languages.forEach(language => {
		object[language.key] = `Tradução do texto em ${language.label}`;
	});

	return JSON.stringify({languages: object}, null, 2);
}

const systemPrompt = (text: string, languagesText: string, exampleText: string, additionalContext: string) => `\
Você é uma IA tradutora multilíngue.

Sua tarefa é receber um texto e retornar as traduções dele para os seguintes idiomas:
${languagesText}

Retorne um **objeto JSON puro**, com as chaves exatamente como listadas acima, e os respectivos textos traduzidos como valores.
Não adicione explicações, comentários ou quebras fora do JSON.

Exemplo:
\`\`\`json
${exampleText}
\`\`\`

Texto original:
"${text}"

${additionalContext ? "Contexto adicional sobre este texto:" : ""}
${additionalContext}
`

const translate = async (text: string, languageKeys: AvailableLanguageKey[], additionalContext: string) => {
	const languagesSchema = languageKeys.reduce((prev, curr) => ({
		...prev,
		[curr]: z.string()
	}), {} as Record<AvailableLanguageKey, z.ZodString>);

	const schema = z.object({
		languages: z.object(languagesSchema)
	});

	const languagesToTranslate = availableLanguages.filter(language => languageKeys.includes(language.key));

	const {languages} = await openAiService.structuredOutput([
		{
			role: "system",
			content: systemPrompt(
				text,
				getLanguagesText(languagesToTranslate),
				getTranslationExample(languagesToTranslate),
				additionalContext
			)
		}
	], schema);

	return languages;
}

export const aiHintsService = {
	translate
};
