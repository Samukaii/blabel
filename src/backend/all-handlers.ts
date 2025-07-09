import { AiHintsHandler } from './handlers/ai-hints/ai-hints.handler';
import { ApplicationLanguagesHandler } from './handlers/application-languages/application-languages.handler';
import { DevelopmentHandler } from './handlers/development/development-handler.js';
import { FilesHandler } from './handlers/files/files.handler.js';
import { WindowHandler } from './handlers/window/window.handler.js';
import { AuthHandler } from './handlers/auth/auth.handler';
import { ProjectsHandler } from './handlers/projects/projects.handler';
import { GitHandler } from './handlers/git/git.handler';
import { ContextFieldsHandler } from './handlers/context-fields/context-fields.handler';
import { TranslationsHandler } from './handlers/translations/translations.handler';
import { ProjectsLanguagesHandler } from './handlers/languages/projects-languages.handler';
import { ElectronHandlers } from '@shared/models/electron-handlers';

export const allHandlers: ElectronHandlers = {
	files: FilesHandler,
	window: WindowHandler,
	translations: TranslationsHandler,
	languages: ApplicationLanguagesHandler,
	contextFields: ContextFieldsHandler,
	git: GitHandler,
	projects: ProjectsHandler,
	aiHints: AiHintsHandler,
	development: DevelopmentHandler,
	auth: AuthHandler,
	projectLanguages: ProjectsLanguagesHandler,
};
