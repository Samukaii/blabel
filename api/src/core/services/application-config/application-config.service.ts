import fs from 'fs';
import { ApplicationConfig } from '../../../models/application-config';

const applicationConfigPath = 'src/data/application-config.json';

const get = () => {
    const file = fs.readFileSync(applicationConfigPath, { encoding: 'utf-8' });

    return JSON.parse(file) as ApplicationConfig;
}

const save = (config: ApplicationConfig) => {
    fs.writeFileSync(applicationConfigPath, JSON.stringify(config, null, 2));
}

const getLanguages = () => {
    const applicationConfig = get();

    return applicationConfig.languageFiles.sort((previous, current) => {
        const previousIsMainLanguage = previous.key === applicationConfig.mainLanguage.key;
        const currentIsMainLanguage = current.key === applicationConfig.mainLanguage.key;

        if (previousIsMainLanguage && !currentIsMainLanguage) return -1;
        if (!previousIsMainLanguage && currentIsMainLanguage) return 1;
        return 0;
    });
}

export const applicationConfigService = {
    get,
    getLanguages,
    save
}