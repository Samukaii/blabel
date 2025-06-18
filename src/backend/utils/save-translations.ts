import { globalJsonResource } from '../core/global-json-resource.js';
import { applicationLanguagesService } from '../services/languages/application-languages.service.js';

export const saveTranslations = async (language: string, object: Record<string, any>) => {
	const registeredLanguages = await applicationLanguagesService.getAllSortedByMain();
	const translationFile = registeredLanguages.find(registeredLanguage => registeredLanguage.key === language);

	if (!translationFile)
		throw new Error(`Language "${language}" not found.`);

	await globalJsonResource(translationFile.path).save(object);
};
