import {
	Component,
	inject,
	input,
	OnInit,
	output,
	resource,
	signal,
} from '@angular/core';
import { FileSelectorComponent } from '../../../shared/components/file-selector/file-selector.component';
import { TranslationFile } from '@shared/models/translation-file';
import { getElectron } from '../../../shared/di/functions/get-electron';
import {
	FktAutocompleteComponent,
	FktButtonComponent,
	FktNoResults,
	SignalFormBuilder,
	SignalValidators,
} from '@frakton-ng/core';
import { LanguageFilePayload } from '../models/language-file-payload';

@Component({
	selector: 'app-language-file-form',
	imports: [
		FileSelectorComponent,
		FktAutocompleteComponent,
		FktButtonComponent,
	],
	templateUrl: './language-file-form.component.html',
	styleUrl: './language-file-form.component.scss',
})
export class LanguageFileFormComponent implements OnInit {
	confirm = output<LanguageFilePayload>();
	language = input<TranslationFile>();
	confirmButtonName = input.required<string>();

	private fb = inject(SignalFormBuilder);
	protected form = this.fb.strictGroup<LanguageFilePayload>({
		key: [null as any, SignalValidators.required()],
		path: ['', SignalValidators.required()],
	});
	private api = getElectron();

	search = signal('');

	protected availableLanguages = resource({
		params: this.search,
		defaultValue: { results: [] },
		loader: async ({ params }) => {
			return await this.api.languages.autocomplete(params);
		},
	});

	protected noResults: FktNoResults = {
		label: 'Nenhum idioma disponível',
		icon: {
			name: 'language',
		},
	};

	ngOnInit() {
		const language = this.language();

		if (language) this.form.patchValue(language);
	}

	protected submit() {
		this.confirm.emit(this.form.value());
	}
}
