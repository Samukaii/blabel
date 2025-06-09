import { Component, inject, output, signal } from '@angular/core';
import { languageFileForm } from './language-file-form';
import { InferFormValueFn } from '../../../shared/models/infer-form-value-fn';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AutocompleteComponent } from '../../../shared/components/autocomplete/autocomplete.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { LanguagesService } from '../languages.service';
import { JsonPipe } from '@angular/common';
import { NoResults } from '../../../shared/models/no-results';
import { FileSelectorComponent } from '../../../shared/components/file-selector/file-selector.component';

@Component({
	selector: 'app-language-file-form',
	imports: [
		ButtonComponent,
		AutocompleteComponent,
		JsonPipe,
		FileSelectorComponent
	],
	templateUrl: './language-file-form.component.html',
	styleUrl: './language-file-form.component.scss'
})
export class LanguageFileFormComponent {
	confirm = output<InferFormValueFn<typeof languageFileForm>>();
	form = languageFileForm();

	private service = inject(LanguagesService);

	search = signal('');

	availableLanguages = rxResource({
		params: this.search,
		defaultValue: [],
		stream: ({params}) =>
			this.service.getAvailableLanguages({search: params})
	});

	noResults: NoResults = {
		label: "Nenhum idioma disponível",
		icon: {
			name: "language"
		}
	}

	submit() {
		this.confirm.emit(this.form.getRawValue());
	}
}
