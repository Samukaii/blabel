import { RequestHandler } from "express";
import { z } from "zod";
import { AvailableLanguageKey } from "../../models/available-languages";
import { applicationLanguagesService } from '../../services/languages/application-languages.service';
import { aiHintsService } from '../../services/ai-hints/ai-hints.service';

const translateEmptyLanguages: RequestHandler = async (req, res) => {
	const {body} = req;

	const schema = z.object({
		additionalContext: z.string(),
		onlyEmptyFields: z.boolean(),
		entries: z.array(z.object({
			language: z.string(),
			value: z.string()
		}))
	});

	const bodyParsed = schema.parse(body);
	const entries = bodyParsed.entries;

	const mainLanguage = await applicationLanguagesService.getMain();

	const mainLanguageValue = entries.find(entry => entry.language === mainLanguage.key)?.value;

	if (!mainLanguageValue)
		throw new Error(`The main language ${mainLanguage.label} was not filled`);


	const languagesToUse = entries.filter(entry => {

		if (!bodyParsed.onlyEmptyFields) return entry.language !== mainLanguage.key;

		console.log(entry, !entry.value && (entry.language !== mainLanguage.key));

		return !entry.value && (entry.language !== mainLanguage.key);
	});
	const languagesToUseKeys = languagesToUse.map(entry => entry.language as AvailableLanguageKey);


	const results = await aiHintsService.translate(mainLanguageValue, languagesToUseKeys, bodyParsed.additionalContext);

	res.json(results);
};


export const aiHintsController = {
	translateEmptyLanguages
};
