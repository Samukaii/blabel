export type ProjectContextFieldType = 'text' | 'textarea' | 'select' | 'checkbox' | 'image' | 'number';

export interface ProjectContextField {
	options: {
		id: `${string}-${string}-${string}-${string}-${string}`;
		label: string;
	}[];
	id: string;
	label: string;
	type: {
		key: ProjectContextFieldType;
		label: string;
	};
	description: string;
	required: boolean;
}
