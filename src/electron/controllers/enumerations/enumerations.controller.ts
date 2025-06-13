import { RequestHandler } from 'express';
import { AvailableLanguage, availableLanguages } from '../../models/available-languages.js';

const getAvailableLanguages: RequestHandler = (req, res) => {
	const {query} = req;

	let results = availableLanguages as AvailableLanguage[];

	const search = query.search as string | undefined;

	if (search)
		results = availableLanguages.filter((lang) =>
			lang.label.toLowerCase().includes(search.toLowerCase()))

	res.json({results});
}

export const enumerationsController = {
	getAvailableLanguages
}
