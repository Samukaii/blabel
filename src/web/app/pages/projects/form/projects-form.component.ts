import { Component, input, OnInit, output, signal } from '@angular/core';
import { projectsForm } from './projects-form';
import { InferFormValueFn } from '../../../shared/models/infer-form-value-fn';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TranslationFile } from '@shared/models/translation-file';
import { formIsValid } from '../../../shared/utils/form-is-valid';
import { InputComponent } from '../../../shared/components/input/input.component';
import { TextareaComponent } from '../../../shared/components/textarea/textarea.component';
import { Project } from '@shared/models/project';


@Component({
	selector: 'app-projects-form',
	imports: [
		ButtonComponent,
		InputComponent,
		TextareaComponent
	],
	templateUrl: './projects-form.component.html',
	styleUrl: './projects-form.component.scss'
})
export class ProjectsFormComponent implements OnInit {
	confirm = output<InferFormValueFn<typeof projectsForm>>();
	title = input.required<string>()
	project = input<Project>()
	confirmButtonName = input.required<string>()

	protected form = projectsForm();

	formIsValid = formIsValid(this.form);
	search = signal('');

	ngOnInit() {
		console.log('Iniciado');

		const project = this.project();

		if (project)
			this.form.patchValue(project);
	}

	protected submit() {
		this.confirm.emit(this.form.getRawValue());
	}

	ngOnDestroy() {
		console.log('destroy');
	}
}
