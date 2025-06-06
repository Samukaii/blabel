import { RequestHandler } from "express";
import { z } from "zod";
import { applicationConfigService } from "../../core/services/application-config/application-config.service";
import { AvailableLanguageKey } from "../../models/available-languages";
import { aiHintsService } from "../../services/ai-hints/ai-hints.service";

const translateEmptyLanguages: RequestHandler = async (req, res) => {
    const { body } = req;

    const schema = z.object({
        additionalContext: z.string(),
        entries: z.array(z.object({
            language: z.string(),
            value: z.string()
        }))
    });

    const bodyParsed = schema.parse(body);
    const entries = bodyParsed.entries;

    const applicationConfig = applicationConfigService.get();

    const mainLanguageValue = entries.find(entry => entry.language === applicationConfig.mainLanguage.key)?.value;

    if (!mainLanguageValue)
        throw new Error(`The main language ${applicationConfig.mainLanguage.label} was not filled`);


    const emptyLanguages = entries.filter(entry => !entry.value);
    const emptyLanguageKeys = emptyLanguages.map(entry => entry.language as AvailableLanguageKey);

    const results = await aiHintsService.translate(mainLanguageValue, emptyLanguageKeys, bodyParsed.additionalContext);

    res.json(results);
};


export const aiHintsController = {
    translateEmptyLanguages
};
