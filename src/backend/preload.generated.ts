// AUTO-GENERATED FILE – DO NOT EDIT
const { contextBridge, ipcRenderer } = require('electron');

const invoke = (handlerName: string, ...args: any[]) => ipcRenderer.invoke(handlerName, ...args);

contextBridge.exposeInMainWorld('electronAPI', {
  files: {
    openDialog: (...args: any[]) => invoke('files:openDialog', ...args)
  },
  window: {
    minimize: (...args: any[]) => invoke('window:minimize', ...args),
    maximize: (...args: any[]) => invoke('window:maximize', ...args),
    close: (...args: any[]) => invoke('window:close', ...args)
  },
  api: {
    translations: {
      getAll: (...args: any[]) => invoke('api:translations:getAll', ...args),
      registerChange: (...args: any[]) => invoke('api:translations:registerChange', ...args),
      getAllChanges: (...args: any[]) => invoke('api:translations:getAllChanges', ...args),
      registerRemoveChange: (...args: any[]) => invoke('api:translations:registerRemoveChange', ...args),
      discardAllChanges: (...args: any[]) => invoke('api:translations:discardAllChanges', ...args),
      revertEntryChange: (...args: any[]) => invoke('api:translations:revertEntryChange', ...args),
      revertTranslationChange: (...args: any[]) => invoke('api:translations:revertTranslationChange', ...args),
      saveAll: (...args: any[]) => invoke('api:translations:saveAll', ...args)
    },
    languages: {
      get: (...args: any[]) => invoke('api:languages:get', ...args),
      add: (...args: any[]) => invoke('api:languages:add', ...args),
      remove: (...args: any[]) => invoke('api:languages:remove', ...args),
      update: (...args: any[]) => invoke('api:languages:update', ...args),
      autocomplete: (...args: any[]) => invoke('api:languages:autocomplete', ...args)
    },
    aiHints: {
      translateEmptyLanguages: (...args: any[]) => invoke('api:aiHints:translateEmptyLanguages', ...args)
    }
  },
  development: {
    openDevTools: (...args: any[]) => invoke('development:openDevTools', ...args),
    isProduction: (...args: any[]) => invoke('development:isProduction', ...args),
    isDebugAllowed: (...args: any[]) => invoke('development:isDebugAllowed', ...args)
  }
});
