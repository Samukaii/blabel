// AUTO-GENERATED FILE – DO NOT EDIT
const { contextBridge, ipcRenderer } = require('electron');

const invoke = (handlerName: string, ...args: any[]) => ipcRenderer.invoke(handlerName, ...args);

contextBridge.exposeInMainWorld('electronAPI', {
  files: {
    openDialog: (...args: any[]) => invoke('files:openDialog', ...args),
    saveDialog: (...args: any[]) => invoke('files:saveDialog', ...args),
    download: (...args: any[]) => invoke('files:download', ...args)
  },
  window: {
    minimize: (...args: any[]) => invoke('window:minimize', ...args),
    maximize: (...args: any[]) => invoke('window:maximize', ...args),
    close: (...args: any[]) => invoke('window:close', ...args)
  },
  translations: {
    getAll: (...args: any[]) => invoke('translations:getAll', ...args),
    registerChange: (...args: any[]) => invoke('translations:registerChange', ...args),
    getAllChanges: (...args: any[]) => invoke('translations:getAllChanges', ...args),
    registerRemoveChange: (...args: any[]) => invoke('translations:registerRemoveChange', ...args),
    discardAllChanges: (...args: any[]) => invoke('translations:discardAllChanges', ...args),
    revertEntryChange: (...args: any[]) => invoke('translations:revertEntryChange', ...args),
    revertTranslationChange: (...args: any[]) => invoke('translations:revertTranslationChange', ...args),
    saveAll: (...args: any[]) => invoke('translations:saveAll', ...args)
  },
  languages: {
    get: (...args: any[]) => invoke('languages:get', ...args),
    add: (...args: any[]) => invoke('languages:add', ...args),
    remove: (...args: any[]) => invoke('languages:remove', ...args),
    update: (...args: any[]) => invoke('languages:update', ...args),
    autocomplete: (...args: any[]) => invoke('languages:autocomplete', ...args)
  },
  git: {
    connect: (...args: any[]) => invoke('git:connect', ...args),
    getBranches: (...args: any[]) => invoke('git:getBranches', ...args),
    getRepositories: (...args: any[]) => invoke('git:getRepositories', ...args),
    getConnection: (...args: any[]) => invoke('git:getConnection', ...args),
    disconnect: (...args: any[]) => invoke('git:disconnect', ...args),
    findFile: (...args: any[]) => invoke('git:findFile', ...args)
  },
  projects: {
    getAll: (...args: any[]) => invoke('projects:getAll', ...args),
    getOne: (...args: any[]) => invoke('projects:getOne', ...args),
    updateOne: (...args: any[]) => invoke('projects:updateOne', ...args),
    create: (...args: any[]) => invoke('projects:create', ...args),
    remove: (...args: any[]) => invoke('projects:remove', ...args),
    languages: {
      getAll: (...args: any[]) => invoke('projects:languages:getAll', ...args),
      getOne: (...args: any[]) => invoke('projects:languages:getOne', ...args),
      updateOne: (...args: any[]) => invoke('projects:languages:updateOne', ...args),
      create: (...args: any[]) => invoke('projects:languages:create', ...args),
      remove: (...args: any[]) => invoke('projects:languages:remove', ...args)
    }
  },
  aiHints: {
    translateEmptyLanguages: (...args: any[]) => invoke('aiHints:translateEmptyLanguages', ...args)
  },
  development: {
    openDevTools: (...args: any[]) => invoke('development:openDevTools', ...args),
    isProduction: (...args: any[]) => invoke('development:isProduction', ...args),
    isDebugAllowed: (...args: any[]) => invoke('development:isDebugAllowed', ...args)
  },
  auth: {
    login: (...args: any[]) => invoke('auth:login', ...args),
    isLoggedIn: (...args: any[]) => invoke('auth:isLoggedIn', ...args),
    logout: (...args: any[]) => invoke('auth:logout', ...args),
    register: (...args: any[]) => invoke('auth:register', ...args),
    currentUser: (...args: any[]) => invoke('auth:currentUser', ...args)
  },
  ai: {
    hasIntegratedAi: (...args: any[]) => invoke('ai:hasIntegratedAi', ...args)
  }
});
