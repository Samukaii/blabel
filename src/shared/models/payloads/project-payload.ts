import { Project } from '../project';

export type ProjectPayload = Pick<Project, 'name' | 'description'> & Partial<Pick<Project, 'sourceBranch' | 'targetBranch' | 'repository'>>;
