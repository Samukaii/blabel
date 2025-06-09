import { AvailableLanguageKey, availableLanguages } from '../../models/available-languages';
import { TranslationFile } from '../../models/translation-file';
import { applicationConfigService } from '../../core/services/application-config/application-config.service';

const getAll = async () => {
	const applicationConfig = await applicationConfigService.get();

	return applicationConfig.languageFiles.sort((previous, current) => {
		const previousIsMainLanguage = previous.isMain;
		const currentIsMainLanguage = current.isMain;

		if (previousIsMainLanguage && !currentIsMainLanguage) return -1;
		if (!previousIsMainLanguage && currentIsMainLanguage) return 1;
		return 0;
	});
}

const getOne = async (key: AvailableLanguageKey) => {
	const config = await applicationConfigService.get();

	return config.languageFiles.find(registeredLanguage => registeredLanguage.key === key);
}

const createValidLanguage = async (language: {
	path: string;
	key: AvailableLanguageKey;
	isMain: boolean
}): Promise<TranslationFile> => {
	const validLanguage = availableLanguages.find(availableLanguage => availableLanguage.key === language.key);

	if (!validLanguage)
		throw new Error(`Language ${language.key} is not a valid language`);

	return {
		...validLanguage,
		...language
	};
}

const updateMain = (languages: TranslationFile[]) => {
	const registeredLanguages = [...languages];

	const hasNoMainLanguage = registeredLanguages.some(registeredLanguage => registeredLanguage.isMain);

	if (hasNoMainLanguage) registeredLanguages[0].isMain = true;

	return registeredLanguages;
}

const add = async (language: { path: string; key: AvailableLanguageKey; isMain: boolean }) => {
	let registeredLanguages = [...await getAll()];

	const isRegistered = await getOne(language.key);

	if (isRegistered)
		throw new Error(`Language ${language.key} is already registered`);

	registeredLanguages.unshift(await createValidLanguage(language));
	const updatedLanguages = updateMain(registeredLanguages);

	await applicationConfigService.update(config => ({
		...config,
		languageFiles: updatedLanguages
	}));
}

const remove = async (languageKey: AvailableLanguageKey) => {
	await applicationConfigService.update(config => ({
		...config,
		languageFiles: config.languageFiles.filter(language => language.key !== languageKey)
	}));
}

const update = async (key: AvailableLanguageKey, language: { path?: string; isMain: boolean }) => {
	const registeredLanguage = getOne(key);

	if (!registeredLanguage)
		throw new Error(`Language "${key}" is not registered`);

	await applicationConfigService.update(config => ({
		...config,
		languageFiles: config.languageFiles.map(registeredLanguage => {
			if (registeredLanguage.key !== key) return registeredLanguage;

			return {
				...registeredLanguage,
				...language
			}
		})
	}))
}

const getMain = async () => {
	const all = await getAll();

	const mainLanguage = all.find(language => language.isMain);

	if (!mainLanguage)
		throw new Error(`No main language is registered`);

	return mainLanguage;
}

export const applicationLanguagesService = {
	getAll,
	getOne,
	update,
	remove,
	getMain,
	add
}
