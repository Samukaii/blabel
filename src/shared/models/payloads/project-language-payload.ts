import { ProjectLanguage } from '@shared/models/project-language';

export type ProjectLanguagePayload = Pick<ProjectLanguage, 'path' | 'key'>;
