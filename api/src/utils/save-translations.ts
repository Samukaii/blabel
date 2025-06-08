import fs from "fs";
import {applicationConfigService} from "../core/services/application-config/application-config.service";

export const saveTranslations = (language: string, object: Record<string, any>) => {
  const registeredLanguages = applicationConfigService.getLanguages();
  const translationFile = registeredLanguages.find(registeredLanguage => registeredLanguage.key === language);

  if(!translationFile)
    throw new Error(`Language "${language}" not found.`);

  fs.writeFileSync(translationFile.path, JSON.stringify(object, null, 2));
};
