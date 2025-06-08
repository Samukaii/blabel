import fs from "fs";

export const saveTranslations = (language: string, object: Record<string, any>) => {
  const rootDir = 'C:\\ambev\\splan\\frontend\\projects\\cosmic-ui\\src\\assets\\i18n';
  const filePath = `${rootDir}\\${language}.json`;

  fs.writeFileSync(filePath, JSON.stringify(object, null, 2));
};
