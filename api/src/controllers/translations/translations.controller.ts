import { RequestHandler } from "express";
import { Translation } from "../../models/translation";
import { TranslationChange } from "../../models/translation-change";
import { translationChangesService } from '../../services/changes/translation-changes.service';
import { applySearch } from '../../utils/apply-search';
import { getWithChanges } from '../../utils/get-with-changes';
import { loadTranslations } from "../../utils/load-translations";


const getAll: RequestHandler = (req, res) => {
    const { query } = req;

    const allChanges = translationChangesService.get();

    const search = query.search as string ?? '';

    const files = loadTranslations();

    const all = getWithChanges(files.entries);

    const results = applySearch(all, search);

    res.json({
        changesCount: allChanges.length,
        languages: files.languages,
        results: results.slice(0, 25)
    })
};


const registerChange: RequestHandler = (req, res) => {
    const { body } = req;

    const change = body.translation as TranslationChange;

    translationChangesService.addChange(change);

    res.json({})
};


const revertEntryChange: RequestHandler = (req, res) => {
    const { params } = req;

    const path = params.path;
    const language = params.language;

    translationChangesService.revertEntryChange(path, language);

    res.json({});
};

const revertTranslationChange: RequestHandler = (req, res) => {
    const { params } = req;

    const path = params.path;

    translationChangesService.revertTranslationChange(path);

    res.json({});
};

const registerRemoveChange: RequestHandler = (req, res) => {
    const { params } = req;

    const path = params.path as string;

    translationChangesService.registerRemoveChange(path);

    res.json({});
};

const discardAllChanges: RequestHandler = (_, res) => {
    translationChangesService.discardAllChanges();

    res.json({});
};


const saveAll: RequestHandler = (_, res) => {
    translationChangesService.saveAll();

    res.json({})
};


export const translationsController = {
    getAll,
    registerChange,
    registerRemoveChange,
    discardAllChanges,
    revertEntryChange,
    revertTranslationChange,
    saveAll
};
