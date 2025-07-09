import { inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { formType } from '../../../../shared/utils/form-type';
import { ProjectContextFieldType } from '@shared/models/project-context-field';

export const projectsContextFieldsForm = () => {
	const fb = inject(FormBuilder);

	return fb.nonNullable.group({
		label: [formType.required<string>(), Validators.required],
		description: [formType.required<string>(), Validators.required],
		type: [formType.required<ProjectContextFieldType>(), Validators.required],
		required: [formType(false), Validators.required],
		options: fb.nonNullable.array([
			fb.nonNullable.group({
				id: [crypto.randomUUID()],
				label: [formType.required<string>(), Validators.required],
			})
		]),
	});
}
