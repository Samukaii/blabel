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
import { Prettify } from '../../web/app/shared/models/prettify';

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
  }
  projects: {
    getAll: () => Promise<ListResponse<Project>>;
    getOne: (id: string) => Promise<SingleResponse<Project | null>>;
    create: (payload: ProjectPayload) => Promise<SingleResponse<Project>>;
    remove: (id: string) => Promise<void>;
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
  }
  ai: {
    hasIntegratedAi: () => PromiseLike<boolean>;
  }
}
