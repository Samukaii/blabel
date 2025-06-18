import { applicationConfigService } from '../../core/services/application-config/application-config.service.js';
import { AvailableLanguageKey } from '@shared/models/available-languages.js';
import { availableLanguages } from '@shared/constants/available-languages.js';
import { TranslationFile } from '@shared/models/translation-file';

const getAllSortedByMain = async () => {
    const applicationConfig = await applicationConfigService.get();

    return applicationConfig.languageFiles.sort((previous, current) => {
        const previousIsMainLanguage = previous.isMain;
        const currentIsMainLanguage = current.isMain;

        if (previousIsMainLanguage && !currentIsMainLanguage) return -1;
        if (!previousIsMainLanguage && currentIsMainLanguage) return 1;
        return 0;
    });
}

const getAll = async () => {
    const applicationConfig = await applicationConfigService.get();

    return applicationConfig.languageFiles;
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
		id: `${language.path}-${language.key}`,
        ...validLanguage,
        ...language
    };
}


const add = async (language: { path: string; key: AvailableLanguageKey; isMain: boolean }) => {
    let registeredLanguages = [...await getAllSortedByMain()];

    const isRegistered = await getOne(language.key);

    if (isRegistered)
        throw new Error(`Language ${language.key} is already registered`);

    const created = await createValidLanguage(language);

    const hasMainLanguage = registeredLanguages.some(registeredLanguage => registeredLanguage.isMain);

    if (created.isMain) {
        registeredLanguages = registeredLanguages.map((language) => {
            return {...language, isMain: false}
        });
        registeredLanguages.unshift(created);

    } else {
        registeredLanguages.unshift(created);
        if (!hasMainLanguage) registeredLanguages[0].isMain = true;
    }

    await applicationConfigService.update(config => ({
        ...config,
        languageFiles: registeredLanguages
    }));
}

const remove = async (languageKey: AvailableLanguageKey) => {
    await applicationConfigService.update(config => ({
        ...config,
        languageFiles: config.languageFiles.filter(language => language.key !== languageKey)
    }));
}

const update = async (key: AvailableLanguageKey, language: { path?: string; isMain: boolean }) => {
    const registeredLanguage = await getOne(key);
    let registeredLanguages = await getAllSortedByMain();

    if (!registeredLanguage)
        throw new Error(`Language "${key}" is not registered`);


    registeredLanguages = registeredLanguages.map(registeredLanguage => {
        if (registeredLanguage.key !== key) return registeredLanguage;

        return {...registeredLanguage, ...language};
    });


    if (language.isMain)
        registeredLanguages = registeredLanguages.map(registeredLanguage => {
            if (registeredLanguage.key !== key) return {...registeredLanguage, isMain: false};

            return {...registeredLanguage, ...language};
        });

    const hasMainLanguage = registeredLanguages.some(registeredLanguage => registeredLanguage.isMain);

    if (!hasMainLanguage) registeredLanguages[0].isMain = true;

    await applicationConfigService.update(config => ({
        ...config,
        languageFiles: registeredLanguages
    }))
}

const getMain = async () => {
    const all = await getAllSortedByMain();

    const mainLanguage = all.find(language => language.isMain);

    if (!mainLanguage)
        throw new Error(`No main language is registered`);

    return mainLanguage;
}

export const applicationLanguagesService = {
    getAllSortedByMain,
    getAll,
    getOne,
    update,
    remove,
    getMain,
    add
}
