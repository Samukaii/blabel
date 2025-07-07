import { inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AvailableLanguageKey } from '@shared/models/available-languages';
import { formType } from '../../../../shared/utils/form-type';

export const projectsLanguagesFileForm = () => {
	const fb = inject(FormBuilder);

	return fb.nonNullable.group({
		key: [formType.required<AvailableLanguageKey>(), Validators.required],
		path: [formType<string>('src/app/assets/i18n/zh-cn.json'), Validators.required],
	});
}
