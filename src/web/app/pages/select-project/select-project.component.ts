import { Component, inject, input, resource } from '@angular/core';
import { AutocompleteComponent } from '../../shared/components/autocomplete/autocomplete.component';
import { FormBuilder, Validators } from '@angular/forms';
import { formType } from '../../shared/utils/form-type';
import { getElectron } from '../../shared/di/functions/get-electron';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AutocompleteOption } from '@shared/models/autocomplete-option';
import { formIsValid } from '../../shared/utils/form-is-valid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-project',
	imports: [
		AutocompleteComponent,
		ButtonComponent,
	],
  templateUrl: './select-project.component.html',
  styleUrl: './select-project.component.scss'
})
export class SelectProjectComponent {
	readonly returnUrl = input('home');
	private readonly electron = getElectron();
	private readonly router = inject(Router);

	protected readonly form = inject(FormBuilder).nonNullable.group({
		projectId: [formType.required<string>(), Validators.required]
	});

	protected readonly formIsValid = formIsValid(this.form);

	protected readonly projects = resource({
		defaultValue: [],
		loader: async () => {
			const {results} = await this.electron.projects.getAll();

			return results.map((project): AutocompleteOption => ({value: project.id, label: project.name}));
		}
	});

	async submit() {
		if(!this.form.valid) return;

		this.electron.projects.select(this.form.controls.projectId.value);

		await this.router.navigateByUrl(this.returnUrl());
	}
}
