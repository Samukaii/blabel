import { ElectronFeatures } from '@shared/models/electron-features.js';
import { aiHintsHandler } from './handlers/ai-hints/ai-hints.handler';
import { applicationLanguagesHandler } from './handlers/application-languages/application-languages.handler';
import { developmentHandler } from './handlers/development/development-handler.js';
import { filesHandler } from './handlers/files/files.handler.js';
import { translationsHandler } from './handlers/translations/translations.handler.js';
import { windowHandler } from './handlers/window/window.handler.js';
import { aiIntegrationKey } from './core/open-ai-client';
import { authHandler } from './handlers/auth/auth.handler';
import { projectsHandler } from './handlers/projects/projects.handler';
import { gitHandler } from './handlers/git/git.handler';

export const ipcHandlers: ElectronFeatures = {
	files: filesHandler,
	window: windowHandler,
	translations: translationsHandler,
	languages: applicationLanguagesHandler,
	git: gitHandler,
	projects: projectsHandler,
	aiHints: aiHintsHandler,
	development: developmentHandler,
	auth: authHandler,
	ai: {
		hasIntegratedAi: async () => !!aiIntegrationKey()
	}
};
