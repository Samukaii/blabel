import { Component, inject, input, resource } from '@angular/core';
import { getElectron } from '../../shared/di/functions/get-electron';
import { AutocompleteOption } from '@shared/models/autocomplete-option';
import { Router } from '@angular/router';
import { FktAutocompleteComponent, FktButtonComponent, SignalFormBuilder, SignalValidators, } from '@frakton-ng/core';

@Component({
	selector: 'app-select-project',
	imports: [FktAutocompleteComponent, FktButtonComponent],
	templateUrl: './select-project.component.html',
	styleUrl: './select-project.component.scss',
})
export class SelectProjectComponent {
	readonly returnUrl = input('home');
	private readonly electron = getElectron();
	private readonly router = inject(Router);

	protected readonly form = inject(SignalFormBuilder).strictGroup<{
		projectId: string;
	}>({
		projectId: [null as unknown as string, SignalValidators.required()],
	});

	protected readonly projects = resource({
		defaultValue: [],
		loader: async () => {
			const { results } = await this.electron.projects.getAll();

			return results.map(
				(project): AutocompleteOption => ({
					value: project.id,
					label: project.name,
				}),
			);
		},
	});

	async submit() {
		if (!this.form.valid) return;

		this.electron.projects.select(this.form.controls.projectId.value());

		await this.router.navigateByUrl(this.returnUrl());
	}
}
