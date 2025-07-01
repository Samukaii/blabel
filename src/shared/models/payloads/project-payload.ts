import { Project } from '../project';

export type ProjectPayload = Pick<Project, 'name' | 'description'>;
