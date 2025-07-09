import { Component, input, OnInit, output, resource, signal } from '@angular/core';
import { languageFileForm } from './language-file-form';
import { InferFormValueFn } from '../../../shared/models/infer-form-value-fn';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AutocompleteComponent } from '../../../shared/components/autocomplete/autocomplete.component';
import { NoResults } from '../../../shared/models/no-results';
import { FileSelectorComponent } from '../../../shared/components/file-selector/file-selector.component';
import { TranslationFile } from '@shared/models/translation-file';
import { getElectron } from '../../../shared/di/functions/get-electron';
import { formIsValid } from '../../../shared/utils/form-is-valid';


@Component({
	selector: 'app-language-file-form',
	imports: [
		ButtonComponent,
		AutocompleteComponent,
		FileSelectorComponent
	],
	templateUrl: './language-file-form.component.html',
	styleUrl: './language-file-form.component.scss'
})
export class LanguageFileFormComponent implements OnInit {
	confirm = output<InferFormValueFn<typeof languageFileForm>>();
	language = input<TranslationFile>()
	confirmButtonName = input.required<string>()

	protected form = languageFileForm();
	private api = getElectron();

	formIsValid = formIsValid(this.form);
	search = signal('');

	protected availableLanguages = resource({
		params: this.search,
		defaultValue: { results: []},
		loader: async ({params}) => {
			return await this.api.languages.autocomplete(params);
		}
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
