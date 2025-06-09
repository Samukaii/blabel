import { RequestHandler } from "express";
import { z } from 'zod';
import { allLanguageKeys } from '../../models/available-languages';
import { applicationLanguagesService } from '../../services/languages/application-languages.service';

const get: RequestHandler = async (_, res) => {
	const results = await applicationLanguagesService.getAll();

	res.json({results});
}

const add: RequestHandler = async (req, res) => {
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
}

const remove: RequestHandler = async (req, res) => {
	const key = z.enum(allLanguageKeys).parse(req.params.languageKey);

	await applicationLanguagesService.remove(key);

	res.status(204);
}

const update: RequestHandler = async (req, res) => {
	const schema = z.object({
		language: z.object({
			path: z.optional(z.string()),
			isMain: z.boolean()
		})
	});

	const key = z.enum(allLanguageKeys).parse(req.params.languageKey);

	await applicationLanguagesService.update(key, schema.parse(req.body).language);

	res.json({});
}

export const applicationLanguagesController = {
	get,
	add,
	remove,
	update
};
