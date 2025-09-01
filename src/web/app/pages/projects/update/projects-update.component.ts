import { Component, input, resource } from '@angular/core';
import { ProjectsFormComponent } from '../form/projects-form.component';
import { getElectron } from '../../../shared/di/functions/get-electron';
import { ProjectsRepositoryComponent } from '../repository/projects-repository.component';
import { RouterLink } from '@angular/router';
import { ProjectsLanguagesComponent } from '../languages/projects-languages.component';
import { ProjectsContextFieldsComponent } from '../context-fields/projects-context-fields.component';
import { FktTabComponent, FktTabsListComponent } from '@frakton-ng/core';

@Component({
	selector: 'app-projects-update',
	imports: [
		ProjectsFormComponent,
		ProjectsRepositoryComponent,
		RouterLink,
		ProjectsLanguagesComponent,
		ProjectsContextFieldsComponent,
		FktTabsListComponent,
		FktTabComponent,
	],
	templateUrl: './projects-update.component.html',
	styleUrl: './projects-update.component.scss',
})
export class ProjectsUpdateComponent {
	id = input.required<string>();
	private electron = getElectron();

	project = resource({
		params: this.id,
		defaultValue: { result: null },
		loader: ({ params: id }) => this.electron.projects.getOne(id),
	});
}
