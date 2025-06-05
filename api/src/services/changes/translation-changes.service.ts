import fs from 'fs';
import { Translation } from '../../models/translation';
import { TranslationChange } from '../../models/translation-change';
import { TranslationEntry } from '../../models/translation-entry';
import { getLanguageByKey } from '../../utils/get-language-by-key';
import { getOriginalEntry } from '../../utils/get-original-entry';
import { getOriginalTranslation } from '../../utils/get-original-translation';
import { getTranslations } from '../../utils/get-translations';
import { groupByLanguage } from '../../utils/group-by-language';
import { updateOrCreateTranslation } from '../../utils/update-or-create-translation';
import { removePathFromObject } from '../../utils/remove-path-from-object';
import { saveTranslations } from '../../utils/save-translations';

const translationChangesPath = 'src/data/translation-changes.json';

export const get = () => {
    const files = fs.readFileSync(translationChangesPath, { encoding: 'utf-8' });

    return JSON.parse(files) as Translation[];
}

const save = (changes: Translation[]) => {
    fs.writeFileSync(translationChangesPath, JSON.stringify(changes, null, 2));
}

const addChange = (change: TranslationChange) => {
    const existent = getOriginalTranslation(change.path);
    const allChanges = get();

    if (!existent) {
        const alreadyRegistered = allChanges.find(registered => registered.path === change.path);

        if (alreadyRegistered) {
            return;
        }

        save([
            ...allChanges,
            {
                path: change.path,
                operation: 'create',
                entries: change.entries.map(entry => ({
                    status: 'idle',
                    language: getLanguageByKey(entry.language),
                    value: entry.value
                }))
            }
        ])

        return;
    }

    const updated: Translation = {
        operation: 'edit',
        path: change.path,
        entries: change.entries.map(entry => {
            const originalValue = getOriginalEntry(existent.path, entry.language)?.value;

            return {
                language: getLanguageByKey(entry.language),
                value: entry.value,
                status: entry.value !== originalValue ? 'edited' : 'idle'
            } as TranslationEntry
        })
    };

    const hasChanges = updated.entries.some(entry => entry.status);

    if (!hasChanges) {
        save(allChanges.filter(existentChange => existentChange.path !== change.path))
        return;
    }

    save(allChanges.map(existentChange => {
        if (existentChange.path === change.path) return updated;

        return existentChange;
    }))

    if (!allChanges.find(existentChange => existentChange.path === change.path))
        save([...allChanges, updated]);
}

const revertEntryChange = (path: string, language: string) => {
    let allChanges = get();

    allChanges = allChanges.map(change => {
        if (change.path !== path) return change;

        return {
            ...change,
            entries: change.entries.map(entry => {
                if (entry.language.key !== language) return entry;

                return getOriginalEntry(path, language)!;
            })
        }
    });

    allChanges = allChanges.filter(change => {
        if (change.operation !== "none" && change.operation !== "edit") return true;

        return change.entries.some(entry => entry.status === "edited");
    });

    save(allChanges);
};

const revertTranslationChange = (path: string) => {
    const allChanges = get();

    save(allChanges.filter(change => change.path !== path));
};

const registerRemoveChange = (path: string) => {
    const allChanges = get();

    const existent = allChanges.find(change => change.path === path);

    if (!existent) {
        const originalTranslation = getOriginalTranslation(path);

        if (!originalTranslation)
            throw new Error(`Translation with path ${path} not found`);

        save([
            ...allChanges,
            {
                ...originalTranslation,
                operation: 'delete'
            }]
        );

        return;
    }

    if (existent.operation === 'create') {
        revertTranslationChange(path);
        return;
    }

    save(allChanges.map(change => {
        if (change.path !== path) return change;

        return {
            ...change,
            operation: 'delete',
            entries: change.entries.map(entry => ({
                ...entry,
                status: 'idle'
            }))
        }
    }))
};

const discardAllChanges = () => {
    save([]);
};

const saveAll = () => {
    const changes = get();

    const files = getTranslations();

    const grouped = groupByLanguage(changes);

    grouped.forEach(change => {
        const obj = files[change.language];

        change.values.forEach(value => {
            if (value.operation === "create" || value.operation === "edit")
                updateOrCreateTranslation(obj, {
                    path: value.path,
                    value: value.entry.value
                });

            if (value.operation === "delete")
                removePathFromObject(obj, value.path);
        });

        saveTranslations(change.language, obj);
    });

    discardAllChanges();
};


export const translationChangesService = {
    addChange,
    revertEntryChange,
    revertTranslationChange,
    registerRemoveChange,
    discardAllChanges,
    saveAll,
    get
}
