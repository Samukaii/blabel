import { applicationConfigService } from '../../core/services/application-config/application-config.service.js';
import { availableLanguages } from '../../../shared/constants/available-languages.js';
import path from 'path';
const getAllSortedByMain = async () => {
    const applicationConfig = await applicationConfigService.get();
    return applicationConfig.languageFiles.sort((previous, current) => {
        const previousIsMainLanguage = previous.isMain;
        const currentIsMainLanguage = current.isMain;
        if (previousIsMainLanguage && !currentIsMainLanguage)
            return -1;
        if (!previousIsMainLanguage && currentIsMainLanguage)
            return 1;
        return 0;
    });
};
const getAll = async () => {
    const applicationConfig = await applicationConfigService.get();
    return applicationConfig.languageFiles;
};
const getOne = async (key) => {
    const config = await applicationConfigService.get();
    return config.languageFiles.find(registeredLanguage => registeredLanguage.key === key);
};
const createValidLanguage = async (language) => {
    const validLanguage = availableLanguages.find(availableLanguage => availableLanguage.key === language.key);
    if (!validLanguage)
        throw new Error(`Language ${language.key} is not a valid language`);
    return {
        id: `${path}-${language.key}`,
        ...validLanguage,
        ...language
    };
};
const add = async (language) => {
    let registeredLanguages = [...await getAllSortedByMain()];
    const isRegistered = await getOne(language.key);
    if (isRegistered)
        throw new Error(`Language ${language.key} is already registered`);
    const created = await createValidLanguage(language);
    const hasMainLanguage = registeredLanguages.some(registeredLanguage => registeredLanguage.isMain);
    if (created.isMain) {
        registeredLanguages = registeredLanguages.map((language) => {
            return { ...language, isMain: false };
        });
        registeredLanguages.unshift(created);
    }
    else {
        registeredLanguages.unshift(created);
        if (!hasMainLanguage)
            registeredLanguages[0].isMain = true;
    }
    await applicationConfigService.update(config => ({
        ...config,
        languageFiles: registeredLanguages
    }));
};
const remove = async (languageKey) => {
    await applicationConfigService.update(config => ({
        ...config,
        languageFiles: config.languageFiles.filter(language => language.key !== languageKey)
    }));
};
const update = async (key, language) => {
    const registeredLanguage = await getOne(key);
    let registeredLanguages = await getAllSortedByMain();
    if (!registeredLanguage)
        throw new Error(`Language "${key}" is not registered`);
    registeredLanguages = registeredLanguages.map(registeredLanguage => {
        if (registeredLanguage.key !== key)
            return registeredLanguage;
        return { ...registeredLanguage, ...language };
    });
    if (language.isMain)
        registeredLanguages = registeredLanguages.map(registeredLanguage => {
            if (registeredLanguage.key !== key)
                return { ...registeredLanguage, isMain: false };
            return { ...registeredLanguage, ...language };
        });
    const hasMainLanguage = registeredLanguages.some(registeredLanguage => registeredLanguage.isMain);
    if (!hasMainLanguage)
        registeredLanguages[0].isMain = true;
    await applicationConfigService.update(config => ({
        ...config,
        languageFiles: registeredLanguages
    }));
};
const getMain = async () => {
    const all = await getAllSortedByMain();
    const mainLanguage = all.find(language => language.isMain);
    if (!mainLanguage)
        throw new Error(`No main language is registered`);
    return mainLanguage;
};
export const applicationLanguagesService = {
    getAllSortedByMain,
    getAll,
    getOne,
    update,
    remove,
    getMain,
    add
};
