import { User } from '@shared/models/user';
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
import { ProjectContextField } from '@shared/models/project-context-field';
import { ProjectContextFieldPayload } from '@shared/models/payloads/project-context-field-payload';
import { AiHintsPayload } from '@shared/models/ai-hints-payload';
import { AvailableLanguageKey } from '@shared/models/available-languages';
import { TranslationFile } from '@shared/models/translation-file';
import { Translation } from '@shared/models/translation';
import { TranslationChange } from '@shared/models/translation-change';
import { TranslationDiff } from '@shared/models/translation-diff';

export interface ElectronFeatures {
	translations: {
		getAll: (options: { search: string }) => Promise<{
			changesCount: any;
			languages: {
				key: AvailableLanguageKey;
				name: string;
			}[];
			results: Translation[];
		}>;
		registerChange: (change: TranslationChange) => Promise<void>;
		getAllChanges: () => Promise<{ results: TranslationDiff[] }>;
		revertEntryChange: (path: string, language: AvailableLanguageKey) => Promise<void>;
		revertTranslationChange: (path: string) => Promise<void>;
		registerRemoveChange: (path: string) => Promise<void>;
		discardAllChanges: () => Promise<void>;
		saveAll: () => Promise<void>;
	};
	languages: {
		get: () => Promise<{
			results: TranslationFile[];
		}>;
		autocomplete: (search: string) => Promise<{
			results: AutocompleteOption[];
		}>;
		add: (language: { key: AvailableLanguageKey; path: string; }) => Promise<void>;
		remove: (languageKey: AvailableLanguageKey) => Promise<void>;
		update: (languageKey: AvailableLanguageKey, languageUpdated: { path?: string; }) => Promise<void>;
	};
	aiHints: {
		translateEmptyLanguages: (payload: AiHintsPayload) => Promise<{
			result: Record<AvailableLanguageKey, string>;
		}>;
		hasIntegratedAi: () => PromiseLike<boolean>;
	};
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
	};
	projects: {
		isConfigured: () => Promise<boolean>;
		select: (projectId: string) => void;
		clearSelected: () => void;
		getAll: () => Promise<ListResponse<Project>>;
		getOne: (id: string) => Promise<SingleResponse<Project | null>>;
		updateOne: (id: string, payload: Partial<AllNullable<ProjectPayload>>) => Promise<SingleResponse<Project | null>>;
		create: (payload: ProjectPayload) => Promise<SingleResponse<Project>>;
		remove: (id: string) => Promise<void>;

	};
	projectLanguages: {
		getAll: (projectId: string) => Promise<ListResponse<ProjectLanguage>>;
		getOne: (projectId: string, id: string) => Promise<SingleResponse<ProjectLanguage | null>>;
		updateOne: (projectId: string, id: string, payload: Partial<AllNullable<ProjectLanguagePayload>>) => Promise<SingleResponse<ProjectLanguage | null>>;
		create: (projectId: string, payload: ProjectLanguagePayload) => Promise<SingleResponse<ProjectLanguage>>;
		remove: (projectId: string, id: string) => Promise<void>;
	}
	contextFields: {
		getAll: (projectId: string) => Promise<ListResponse<ProjectContextField>>;
		getOne: (projectId: string, id: string) => Promise<SingleResponse<ProjectContextField | null>>;
		updateOne: (projectId: string, id: string, payload: Partial<AllNullable<ProjectContextFieldPayload>>) => Promise<SingleResponse<ProjectContextField | null>>;
		create: (projectId: string, payload: ProjectContextFieldPayload) => Promise<SingleResponse<ProjectContextField>>;
		remove: (projectId: string, id: string) => Promise<void>;
	}
	auth: {
		getCurrentUser: () => Promise<User | null>;
		refreshUser: () => Promise<User | null>;
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
}
