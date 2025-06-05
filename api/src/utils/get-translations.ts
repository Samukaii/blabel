import fs from "fs";
import path from "path";
import { Translation } from "../models/translation";
import { translationFilesLoader } from "./translation-files-loader";

export const getTranslations = () => {
  const files = translationFilesLoader.get();
  const translationsByLang: Record<string, Record<string, string>> = {};

  files.forEach(file => {
    const filePath = path.resolve(file.path);
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);

    translationsByLang[file.language] = parsed;
  });

  return translationsByLang;
};