import { inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { formType } from "../../../shared/utils/form-type";

export const projectsForm = () => {
	const fb = inject(FormBuilder);

	return fb.nonNullable.group({
		name: [formType.required<string>(), Validators.required],
		description: [formType<string>()],
	});
}
