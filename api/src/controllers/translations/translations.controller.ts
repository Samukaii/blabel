import { RequestHandler } from "express";
import { Translation } from "../../models/translation";
import { TranslationChange } from "../../models/translation-change";
import { translationChangesService } from "../../services/changes/translation-changes.service";
import { applySearch } from "../../utils/apply-search";
import { getWithChanges } from "../../utils/get-with-changes";
import { loadTranslations } from "../../utils/load-translations";
import { getOriginalEntry } from "../../utils/get-original-entry";
import { TranslationDiff } from "../../models/translation-diff";

const getAll: RequestHandler = (req, res) => {
  const { query } = req;

  const allChanges = translationChangesService.get();

  const search = (query.search as string) ?? "";

  const files = loadTranslations();

  const all = getWithChanges(files.entries);

  const results = applySearch(all, search);

  res.json({
    changesCount: allChanges.length,
    languages: files.languages,
    results: results.slice(0, 25),
  });
};

const registerChange: RequestHandler = (req, res) => {
  const { body } = req;

  const change = body.translation as TranslationChange;

  translationChangesService.addChange(change);

  res.json({});
};

const getAllChanges: RequestHandler = (_, res) => {
  const translations = translationChangesService.get();

  const changes: TranslationDiff[] = [
    {
      operation: "create",
      entries: [],
    },
    {
      operation: "edit",
      entries: [],
    },
    {
      operation: "delete",
      entries: [],
    },
  ];

  translations.forEach((translation) => {
    const existent = changes.find(
      (change) => change.operation === translation.operation
    );

    if (!existent) return;

    existent.entries.push({
      path: translation.path,
      languages: translation.entries.map((entry) => {
        if (translation.operation === "create")
          return {
            label: entry.language.label,
            oldValue: null,
            newValue: entry.value,
          };

        if (translation.operation === "delete")
          return {
            label: entry.language.label,
            oldValue: entry.originalValue,
            newValue: null,
          };

        if (entry.value === entry.originalValue) return;

        return {
          label: entry.language.label,
          oldValue: entry.originalValue,
          newValue: entry.value,
        };
      }).filter(entry => !!entry),
    });
  });

  res.json({
    results: changes,
  });
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

  res.json({});
};

export const translationsController = {
  getAll,
  registerChange,
  getAllChanges,
  registerRemoveChange,
  discardAllChanges,
  revertEntryChange,
  revertTranslationChange,
  saveAll,
};
