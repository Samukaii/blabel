import { jsonFileManager } from '../core/json-file-manager.js';
import { applicationLanguagesService } from '../services/languages/application-languages.service.js';

export const saveTranslations = async (language: string, object: Record<string, any>) => {
	const registeredLanguages = await applicationLanguagesService.getAllSortedByMain();
	const translationFile = registeredLanguages.find(registeredLanguage => registeredLanguage.key === language);

	if (!translationFile)
		throw new Error(`Language "${language}" not found.`);

	await jsonFileManager(translationFile.path).save(object);
};
