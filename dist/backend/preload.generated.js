"use strict";
// AUTO-GENERATED FILE – DO NOT EDIT
const { contextBridge, ipcRenderer } = require('electron');
const invoke = (handlerName, ...args) => ipcRenderer.invoke(handlerName, ...args);
contextBridge.exposeInMainWorld('electronAPI', {
    files: {
        openDialog: (...args) => invoke('files:openDialog', ...args)
    },
    window: {
        minimize: (...args) => invoke('window:minimize', ...args),
        maximize: (...args) => invoke('window:maximize', ...args),
        close: (...args) => invoke('window:close', ...args)
    },
    api: {
        translations: {
            getAll: (...args) => invoke('api:translations:getAll', ...args),
            registerChange: (...args) => invoke('api:translations:registerChange', ...args),
            getAllChanges: (...args) => invoke('api:translations:getAllChanges', ...args),
            registerRemoveChange: (...args) => invoke('api:translations:registerRemoveChange', ...args),
            discardAllChanges: (...args) => invoke('api:translations:discardAllChanges', ...args),
            revertEntryChange: (...args) => invoke('api:translations:revertEntryChange', ...args),
            revertTranslationChange: (...args) => invoke('api:translations:revertTranslationChange', ...args),
            saveAll: (...args) => invoke('api:translations:saveAll', ...args)
        },
        languages: {
            get: (...args) => invoke('api:languages:get', ...args),
            add: (...args) => invoke('api:languages:add', ...args),
            remove: (...args) => invoke('api:languages:remove', ...args),
            update: (...args) => invoke('api:languages:update', ...args),
            autocomplete: (...args) => invoke('api:languages:autocomplete', ...args)
        },
        aiHints: {
            translateEmptyLanguages: (...args) => invoke('api:aiHints:translateEmptyLanguages', ...args)
        }
    }
});
