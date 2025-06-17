import { ElectronFeatures } from '@shared/models/electron-features.js';
import { aiHintsHandler } from './handlers/ai-hints/ai-hints.handler';
import { applicationLanguagesHandler } from './handlers/application-languages/application-languages.handler';
import { developmentHandlers } from './handlers/development/development-handlers.js';
import { filesHandler } from './handlers/files/files.handler.js';
import { translationsHandler } from './handlers/translations/translations.handler.js';
import { windowHandler } from './handlers/window/window.handler.js';

export const ipcHandlers: ElectronFeatures = {
	files: filesHandler,
	window: windowHandler,
	api: {
		translations: translationsHandler,
		languages: applicationLanguagesHandler,
		aiHints: aiHintsHandler
	},
	development: developmentHandlers
};
