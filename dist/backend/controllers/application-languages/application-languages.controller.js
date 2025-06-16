import { z } from 'zod';
import { applicationLanguagesService } from '../../services/languages/application-languages.service.js';
import { allLanguageKeys } from '../../../shared/constants/all-language-keys.js';
const get = async (_, res) => {
    const results = await applicationLanguagesService.getAll();
    res.json({ results: results.sort((a, b) => a.label.localeCompare(b.label)) });
};
const add = async (req, res) => {
    const schema = z.object({
        language: z.object({
            key: z.enum(allLanguageKeys),
            path: z.string(),
            isMain: z.boolean()
        })
    });
    const body = schema.parse(req.body);
    await applicationLanguagesService.add(body.language);
    res.json({});
};
const remove = async (req, res) => {
    const key = z.enum(allLanguageKeys).parse(req.params["languageKey"]);
    await applicationLanguagesService.remove(key);
    res.status(204);
};
const update = async (req, res) => {
    const schema = z.object({
        language: z.object({
            path: z.optional(z.string()),
            isMain: z.boolean()
        })
    });
    const key = z.enum(allLanguageKeys).parse(req.params["languageKey"]);
    await applicationLanguagesService.update(key, schema.parse(req.body).language);
    res.json({});
};
export const applicationLanguagesController = {
    get,
    add,
    remove,
    update
};
