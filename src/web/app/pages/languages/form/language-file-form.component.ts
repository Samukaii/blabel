import { Component, computed, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { languageFileForm } from './language-file-form';
import { InferFormValueFn } from '../../../shared/models/infer-form-value-fn';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AutocompleteComponent } from '../../../shared/components/autocomplete/autocomplete.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { LanguagesService } from '../languages.service';
import { NoResults } from '../../../shared/models/no-results';
import { FileSelectorComponent } from '../../../shared/components/file-selector/file-selector.component';
import { CheckboxComponent } from '../../../shared/components/checkbox/checkbox.component';
import { LanguageFile } from '../../../shared/models/language-file';
import { FormGroup } from '@angular/forms';

const formStatusSignal = <Form extends FormGroup>(formGroup: Form) => {
	const destroyRef = inject(DestroyRef);

	const statusSignal = signal(formGroup.status);

	const subscription = formGroup.statusChanges.subscribe(status => {
		statusSignal.set(status);
	});

	destroyRef.onDestroy(() => {
		subscription.unsubscribe();
	});

	return statusSignal;
}

const formIsValid = (form: FormGroup) => {
	const status = formStatusSignal(form);

	return computed(() => {
		status();

		return form.valid
	})
}


@Component({
	selector: 'app-language-file-form',
	imports: [
		ButtonComponent,
		AutocompleteComponent,
		FileSelectorComponent,
		CheckboxComponent
	],
	templateUrl: './language-file-form.component.html',
	styleUrl: './language-file-form.component.scss'
})
export class LanguageFileFormComponent implements OnInit {
	confirm = output<InferFormValueFn<typeof languageFileForm>>();
	language = input<LanguageFile>()
	confirmButtonName = input.required<string>()

	protected form = languageFileForm();
	private service = inject(LanguagesService);

	formIsValid = formIsValid(this.form);
	search = signal('');

	protected availableLanguages = rxResource({
		params: this.search,
		defaultValue: [],
		stream: ({params}) =>
			this.service.getAvailableLanguages({search: params})
	});

	protected noResults: NoResults = {
		label: "Nenhum idioma disponível",
		icon: {
			name: "language"
		}
	}

	ngOnInit() {
		const language = this.language();

		if (language)
			this.form.patchValue(language);
	}

	protected submit() {
		this.confirm.emit(this.form.getRawValue());
	}
}
