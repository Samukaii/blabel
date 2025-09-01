import { Component, inject, input, OnInit, output, resource, signal, } from '@angular/core';
import { projectsLanguagesFileForm } from './projects-languages-file-form';
import { InferFormValueFn } from '../../../../shared/models/infer-form-value-fn';
import { getElectron } from '../../../../shared/di/functions/get-electron';
import { NoResults } from '../../../../shared/models/no-results';
import { ProjectLanguage } from '@shared/models/project-language';
import { Project } from '@shared/models/project';
import { GitFileCheckerComponent } from '../../../../shared/components/git-file-checker/git-file-checker.component';
import { GitIntegrationFile } from '@shared/models/git-integration-file';
import {
	FktAutocompleteComponent,
	FktButtonComponent,
	FktInputComponent,
	SignalFormBuilder,
	SignalValidators,
} from '@frakton-ng/core';
import { ProjectLanguagePayload } from '@shared/models/payloads/project-language-payload';

@Component({
	selector: 'app-projects-languages-file-form',
	imports: [
		GitFileCheckerComponent,
		FktInputComponent,
		FktAutocompleteComponent,
		FktButtonComponent,
	],
	templateUrl: './projects-languages-file-form.component.html',
	styleUrl: './projects-languages-file-form.component.scss',
})
export class ProjectsLanguagesFileFormComponent implements OnInit {
	confirm = output<InferFormValueFn<typeof projectsLanguagesFileForm>>();
	language = input<ProjectLanguage>();
	project = input.required<Project>();
	confirmButtonName = input.required<string>();
	title = input.required<string>();

	private fb = inject(SignalFormBuilder);
	private api = getElectron();

	protected form = this.fb.strictGroup<ProjectLanguagePayload>({
		key: [null as any, SignalValidators.required()],
		path: ['', SignalValidators.required()],
	});

	search = signal('');
	fileResult = signal<GitIntegrationFile>({ status: 'not-checked' });

	protected availableLanguages = resource({
		params: this.search,
		defaultValue: { results: [] },
		loader: ({ params }) => this.api.languages.autocomplete(params),
	});

	protected noResults: NoResults = {
		label: 'Nenhum idioma disponível',
		icon: {
			name: 'language',
		},
	};

	file = signal<string>('');

	ngOnInit() {
		const language = this.language();

		if (language) this.form.patchValue(language);
	}

	protected submit() {
		this.confirm.emit(this.form.value());
	}
}
