import { Component, input, resource } from '@angular/core';
import { ProjectsFormComponent } from '../form/projects-form.component';
import { getElectron } from '../../../shared/di/functions/get-electron';
import { TabsContainerComponent } from '../../../shared/components/tabs/tabs-container.component';
import { TabComponent } from '../../../shared/components/tabs/tab/tab.component';
import { ProjectsRepositoryComponent } from '../repository/projects-repository.component';
import { RouterLink } from '@angular/router';
import { ProjectsLanguagesComponent } from '../languages/projects-languages.component';
import { ProjectsContextFieldsComponent } from '../context-fields/projects-context-fields.component';

@Component({
  selector: 'app-projects-update',
	imports: [
		ProjectsFormComponent,
		TabsContainerComponent,
		TabComponent,
		ProjectsRepositoryComponent,
		RouterLink,
		ProjectsLanguagesComponent,
		ProjectsContextFieldsComponent
	],
  templateUrl: './projects-update.component.html',
  styleUrl: './projects-update.component.scss'
})
export class ProjectsUpdateComponent {
	id = input.required<string>();
	private electron = getElectron();

	project = resource({
		params: this.id,
		defaultValue: {result: null},
		loader: ({params: id}) => this.electron.projects.getOne(id)
	});
}
