import { ProjectContextField, ProjectContextFieldType } from '@shared/models/project-context-field';

export type ProjectContextFieldPayload = Pick<ProjectContextField,
	'label' |
	'options' |
	'required' |
	'description'
> & {
	type: ProjectContextFieldType
};
