import fs from 'fs';
import path from "path";
import { TranslationFile } from '../models/translation-file';

const translationFilesPath = 'src/data/translation-files.json';

export const loadByDirectory = (folderName: string) => {
    const files = fs.readdirSync(folderName);

    const all = files.filter(file => file.endsWith(".json")).map(file => ({
        path: `${folderName}\\${file}`,
        language: file.replace('.json', ''),
        label: ""
    }));

    fs.writeFileSync(translationFilesPath, JSON.stringify(all, null, 2));
}

export const get = () => {
    const files = fs.readFileSync(translationFilesPath, {encoding: 'utf-8'});

    return JSON.parse(files) as TranslationFile[];
}

export const translationsFormatter = {
};
