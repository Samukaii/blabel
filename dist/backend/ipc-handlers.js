import { translationsHandler } from './handlers/translations/translations.handler.js';
import { filesHandler } from './handlers/files/files.handler.js';
import { windowHandler } from './handlers/window/window.handler.js';
import { applicationLanguagesHandler } from './handlers/application-languages/application-languages.handler.js';
import { aiHintsHandler } from './handlers/ai-hints/ai-hints.handler.js';
export const ipcHandlers = {
    files: filesHandler,
    window: windowHandler,
    api: {
        translations: translationsHandler,
        languages: applicationLanguagesHandler,
        aiHints: aiHintsHandler
    }
};
