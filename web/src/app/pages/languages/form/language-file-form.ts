import { inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { formType } from "../../../shared/utils/form-type";

export const languageFileForm = () => {
	const fb = inject(FormBuilder);

	return fb.nonNullable.group({
		key: [formType.required<string>()],
		path: [formType.required<string>()],
		isMain: [formType(false)]
	});
}
