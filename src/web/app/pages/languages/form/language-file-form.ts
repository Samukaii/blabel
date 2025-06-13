import { inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { formType } from "../../../shared/utils/form-type";

export const languageFileForm = () => {
	const fb = inject(FormBuilder);

	return fb.nonNullable.group({
		key: [formType.required<string>(), Validators.required],
		path: [formType.required<string>(), Validators.required],
		isMain: [formType(false)]
	});
}
