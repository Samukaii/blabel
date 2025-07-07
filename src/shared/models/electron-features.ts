import { User } from '@shared/models/user';
import { TranslationsHandler } from '@shared/models/handlers/translations-handler';
import { LanguagesHandler } from '@shared/models/handlers/languages-handler';
import { AiHintsHandler } from '@shared/models/handlers/ai-hints-handler';
import { Project } from '@shared/models/project';
import { ProjectPayload } from '@shared/models/payloads/project-payload';
import { LoginPayload, RegisterPayload } from '@shared/models/payloads/auth-payload';
import { ListResponse } from '@shared/models/list-response';
import { SingleResponse } from '@shared/models/single-response';
import { GitConnectPayload } from '@shared/models/payloads/git-connect-payload';
import { GitConnectionResponse } from '@shared/models/responses/git-connection-response';
import { AutocompleteOption } from '@shared/models/autocomplete-option';
import { AllNullable } from '@shared/models/all-nullable';
import { ProjectLanguage } from '@shared/models/project-language';
import { ProjectLanguagePayload } from '@shared/models/payloads/project-language-payload';
import { GitIntegrationFile } from '@shared/models/git-integration-file';

export interface ElectronFeatures {
	translations: TranslationsHandler;
	languages: LanguagesHandler;
	aiHints: AiHintsHandler;
	window: {
		close: () => void;
		minimize: () => void;
		maximize: () => void;
	};
	git: {
		connect: (payload: GitConnectPayload) => Promise<GitConnectionResponse>;
		getBranches: (projectId: string, repository: string) => Promise<ListResponse<AutocompleteOption>>;
		getRepositories: (projectId: string) => Promise<ListResponse<AutocompleteOption>>;
		getConnection: (projectId: string) => Promise<GitConnectionResponse>;
		disconnect: (projectId: string) => Promise<void>;
		findFile: (projectId: string, path: string) => Promise<GitIntegrationFile>;
	}
	projects: {
		getAll: () => Promise<ListResponse<Project>>;
		getOne: (id: string) => Promise<SingleResponse<Project | null>>;
		updateOne: (id: string, payload: Partial<AllNullable<ProjectPayload>>) => Promise<SingleResponse<Project | null>>;
		create: (payload: ProjectPayload) => Promise<SingleResponse<Project>>;
		remove: (id: string) => Promise<void>;
		languages: {
			getAll: (projectId: string) => Promise<ListResponse<ProjectLanguage>>;
			getOne: (projectId: string, id: string) => Promise<SingleResponse<ProjectLanguage | null>>;
			updateOne: (projectId: string, id: string, payload: Partial<AllNullable<ProjectLanguagePayload>>) => Promise<SingleResponse<ProjectLanguage | null>>;
			create: (projectId: string, payload: ProjectLanguagePayload) => Promise<SingleResponse<ProjectLanguage>>;
			remove: (projectId: string, id: string) => Promise<void>;
		}
	}
	auth: {
		currentUser: () => Promise<User | null>;
		isLoggedIn: () => Promise<boolean>;
		register: (payload: RegisterPayload) => Promise<User>;
		login: (payload: LoginPayload) => Promise<User>;
		logout: () => Promise<void>;
	}
	development: {
		openDevTools: () => void;
		isProduction: () => Promise<boolean>,
		isDebugAllowed: () => Promise<boolean>;
	}
	files: {
		openDialog: () => Promise<string | null>;
		saveDialog: (suggestedName: string) => Promise<string | null>;
	}
	ai: {
		hasIntegratedAi: () => PromiseLike<boolean>;
	}
}
