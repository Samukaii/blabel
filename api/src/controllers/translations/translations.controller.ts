import { RequestHandler } from "express";
import { getTranslations, loadTranslations, saveTranslations } from "../../utils/load-translations";
import { Translation } from "../../models/translation";
import { TranslationEntry } from "../../models/translation-entry";
import { TranslationChange } from "../../models/translation-change";
import { translationFilesLoader } from "../../utils/translation-files-loader";
import { TranslationLanguage } from "../../models/translation-language";

let allChanges: Translation[] = [];


const getAll: RequestHandler = (req, res) => {
    const { query } = req;

    const search = query.search as string ?? '';

    const files = loadTranslations();

    const searchLower = search.toLowerCase();

    const newChanges = allChanges.filter(change => !files.entries.some(entry => change.path === entry.path));
    const remapped = files.entries.filter(result => !newChanges.some(change => change.path === result.path)).map(entry => {
        const existentChange = allChanges.find(change => change.path === entry.path);

        if (existentChange) return existentChange;

        return entry;
    })

    const all = [
        ...newChanges,
        ...remapped
    ];

    const results = all.filter(({ path, entries }) => {
        return (
            path.toLowerCase().includes(searchLower) ||
            entries.some(lang => lang.value?.toLowerCase().includes(searchLower))
        );
    });


    res.json({
        changesCount: allChanges.length,
        languages: files.languages,
        results: results.slice(0, 25)
    })
};

const groupByLanguage = (translations: Translation[]) => {
    const grouped: { language: string; values: { path: string; entry: TranslationEntry }[] }[] = [];

    translations.forEach(translation => {
        translation.entries.forEach(entry => {
            const existentLanguage = grouped.find(item => item.language === entry.language.key);

            if(!entry.edited && !translation.isNew) return;

            if (existentLanguage)
                existentLanguage.values.push({
                    entry,
                    path: translation.path
                });
            else grouped.push({
                language: entry.language.key,
                values: [{
                    path: translation.path,
                    entry
                }]
            });
        })
    });

    return grouped;
}

function updateTranslation(obj: Record<string, any>, entry: { path: string, value: string }) {
    const keys = entry.path.split('.');
    let current = obj;

    for (let index = 0; index < keys.length - 1; index++) {
        const key = keys[index];
        if (!(key in current)) current[key] = {};
        current = current[key];
    }

    current[keys[keys.length - 1]] = entry.value;
};


const getOriginalTranslation = (path: string) => {
    const originalTranslations = loadTranslations().entries;

    return originalTranslations.find(previous => previous.path === path) ?? null;
}

const getOriginalEntry = (path: string, language: string) => {
    const existent = getOriginalTranslation(path);

    if (!existent) return null;

    const entry = existent.entries.find(existentEntry => existentEntry.language.key === language);

    if (!entry)
        throw new Error(`Language "${language}" not found`);

    return entry;
}

const getLanguageByKey = (language: string) => {
    const all = translationFilesLoader.get();

    const foundLanguage = all.find(registered => registered.language === language);

    if (!foundLanguage)
        throw new Error(`Language "${language}" not found`);

    return {
        key: foundLanguage.language,
        label: foundLanguage.label
    } as TranslationLanguage;
}

const registerChange: RequestHandler = (req, res) => {
    const { body } = req;

    const change = body.translation as TranslationChange;

    const existent = getOriginalTranslation(change.path);

    if (!existent) {
        const alreadyRegistered = allChanges.find(registered => registered.path === change.path);

        if (alreadyRegistered) {
            res.json({})

            return;
        }

        allChanges.push({
            path: change.path,
            isNew: true,
            entries: change.entries.map(entry => ({
                edited: false,
                language: getLanguageByKey(entry.language),
                value: entry.value
            }))
        });

        res.json({})
        return;
    }

    const updated: Translation = {
        isNew: false,
        path: change.path,
        entries: change.entries.map(entry => {
            const originalValue = getOriginalEntry(existent.path, entry.language)?.value;

            return {
                language: getLanguageByKey(entry.language),
                value: entry.value,
                edited: entry.value !== originalValue
            } as TranslationEntry
        })
    };

    const hasChanges = updated.entries.some(entry => entry.edited);

    if (!hasChanges) {
        allChanges = allChanges.filter(existentChange => existentChange.path !== change.path);

        res.json({});
        return;
    }

    allChanges = allChanges.map(existentChange => {
        if(existentChange.path === change.path) return updated;

        return existentChange;
    });

    if(!allChanges.find(existentChange => existentChange.path === change.path))
        allChanges.push(updated);

    res.json({})
};

const resetChange: RequestHandler = (req, res) => {
    const {body} = req;

    const translation = body.translation;
    const path = translation.path;
    const language = translation.language;

    allChanges = allChanges.map(change => {
        if(change.path !== path) return change;

        return {
            ...change,
            entries: change.entries.map(entry => {
                if(entry.language.key !== language) return entry;

                return getOriginalEntry(path, language)!;
            })
        }
    });

    allChanges = allChanges.filter(change => {
        if(change.isNew) return true;

        return change.entries.some(entry => entry.edited);
    });

    res.json({});
};

const saveAll: RequestHandler = (_, res) => {
    const changes = allChanges;

    const files = getTranslations();

    const grouped = groupByLanguage(changes);

    console.log(grouped);

    grouped.forEach(change => {
        const obj = files[change.language];

        change.values.forEach(value => {
            updateTranslation(obj, {
                path: value.path,
                value: value.entry.value
            });
        });

        saveTranslations(change.language, obj);
    });

    allChanges = [];

    res.json({})
};


export const translationsController = {
    getAll,
    registerChange,
    resetChange,
    saveAll
};
