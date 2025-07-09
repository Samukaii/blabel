import { openAiService } from '../../core/services/openai/openai.service.js';
import { z } from "zod";
import { AvailableLanguage, AvailableLanguageKey } from '@shared/models/available-languages.js';
import { availableLanguages } from '@shared/constants/available-languages.js';
import { Injectable } from '../../di/di';


@Injectable({providedIn: "root"})
export class AiHintsService {
	async translate(text: string, languageKeys: AvailableLanguageKey[], additionalContext: string) {
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
				content: this.systemPrompt(
					text,
					this.getLanguagesText(languagesToTranslate),
					this.getTranslationExample(languagesToTranslate),
					additionalContext
				)
			}
		], schema);

		return languages;
	}

	private getTranslationExample(languages: AvailableLanguage[]) {
		const object: Record<string, string> = {};

		languages.forEach(language => {
			object[language.key] = `Tradução do texto em ${language.name}`;
		});

		return JSON.stringify({languages: object}, null, 2);
	}

	private getLanguagesText(languages: AvailableLanguage[]) {
		return languages.map(language => `- ${language.name} (chave: ${language.key})`).join('\n');
	}

	private systemPrompt(text: string, languagesText: string, exampleText: string, additionalContext: string) {
		return `\
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

			${additionalContext ? "Contexto adicional sobre este texto:":""}
			${additionalContext}
			`
	}
}
