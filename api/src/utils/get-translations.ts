import fs from "fs";
import path from "path";
import { applicationConfigService } from "../core/services/application-config/application-config.service";

export const getTranslations = () => {
  const files = applicationConfigService.getLanguages();
  const translationsByLang: Record<string, Record<string, string>> = {};

  files.forEach(file => {
    const filePath = path.resolve(file.path);
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);

    translationsByLang[file.key] = parsed;
  });

  return translationsByLang;
};
