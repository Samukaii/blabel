import { Component, computed, input, OnInit, output, resource, signal } from '@angular/core';
import { projectsLanguagesFileForm } from './projects-languages-file-form';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AutocompleteComponent } from '../../../../shared/components/autocomplete/autocomplete.component';
import { InferFormValueFn } from '../../../../shared/models/infer-form-value-fn';
import { getElectron } from '../../../../shared/di/functions/get-electron';
import { formIsValid } from 'web/app/shared/utils/form-is-valid';
import { NoResults } from '../../../../shared/models/no-results';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ProjectLanguage } from "@shared/models/project-language";
import { Project } from "@shared/models/project";
import { GitFileCheckerComponent } from '../../../../shared/components/git-file-checker/git-file-checker.component';
import { formValueToSignal } from '../../../../shared/utils/control-value-to-signal';
import { GitIntegrationFile } from '@shared/models/git-integration-file';


@Component({
	selector: 'app-projects-languages-file-form',
	imports: [
		ButtonComponent,
		AutocompleteComponent,
		InputComponent,
		GitFileCheckerComponent,
	],
	templateUrl: './projects-languages-file-form.component.html',
	styleUrl: './projects-languages-file-form.component.scss'
})
export class ProjectsLanguagesFileFormComponent implements OnInit {
	confirm = output<InferFormValueFn<typeof projectsLanguagesFileForm>>();
	language = input<ProjectLanguage>();
	project = input.required<Project>();
	confirmButtonName = input.required<string>()
	title = input.required<string>()

	protected form = projectsLanguagesFileForm();
	private api = getElectron();

	formIsValid = formIsValid(this.form);
	search = signal('');
	fileResult = signal<GitIntegrationFile>({status: "not-checked"});

	private formValue = formValueToSignal(this.form, {checkEquality: true});
	protected path = computed(() => this.formValue().path);

	protected availableLanguages = resource({
		params: this.search,
		defaultValue: { results: []},
		loader: ({params}) =>
			this.api.languages.autocomplete(params)
	});

	protected noResults: NoResults = {
		label: "Nenhum idioma disponível",
		icon: {
			name: "language"
		}
	}

	file = signal<string>('');

	ngOnInit() {
		const language = this.language();

		if (language)
			this.form.patchValue(language);
	}

	protected submit() {
		this.confirm.emit(this.form.getRawValue());
	}
}
