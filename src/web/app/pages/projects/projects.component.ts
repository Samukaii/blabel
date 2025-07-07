import { Component, computed, inject, resource } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { getElectron } from '../../shared/di/functions/get-electron';
import { TableColumnFn } from '../../shared/components/table/models/table-column-fn';
import { Project } from '@shared/models/project';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { ProjectsFormComponent } from './form/projects-form.component';
import { TableActionFn } from '../../shared/components/table/models/table-action-fn';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonAction } from '../../shared/components/button/models/button-action';

@Component({
	selector: 'app-projects',
	imports: [
		TableComponent
	],
	templateUrl: './projects.component.html',
	styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
	private electron = getElectron();
	private dialog = inject(DialogService);
	private router = inject(Router);
	private route = inject(ActivatedRoute);

	protected createAction: ButtonAction = {
		icon: "plus",
		text: "Adicionar",
		iconPosition: 'left',
		identifier: "create",
		click: () => {
			this.create();
		}
	}

	projects = resource({
		defaultValue: {results: []},
		loader: async () => {
			const projects = await this.electron.projects.getAll();

			console.log(projects);

			return projects;
		}
	});

	columnsFn = computed((): TableColumnFn<Project> => {
		return element => [
			{
				position: "name",
				name: "Nome",
				cell: {
					type: "default",
					options: {
						value: element.name
					}
				}
			},
			{
				position: "description",
				name: "Descrição",
				cell: {
					type: "default",
					options: {
						value: element.description ?? '--'
					}
				}
			},

		]
	});

	actionsFn: TableActionFn<Project> = (project) => [
		{
			icon: "pencil-square",
			name: "edit",
			classes: ['text-blue-900'],
			condition: true,
			click: async () => {
				await this.update(project);
			}
		},
		{
			icon: "trash",
			name: "revert",
			condition: true,
			classes: ['text-red-500'],
			click: async () => {
				await this.remove(project);
			}
		},
	];

	private async update(project: Project) {
		await this.router.navigate([project.id], {
			relativeTo: this.route
		})
	};

	private async remove(project: Project) {
		await this.electron.projects.remove(project.id);
		this.projects.reload();
	};

	protected create() {
		this.dialog.open({
			component: ProjectsFormComponent,
			data: {
				title: "Criar projeto",
				confirmButtonName: "Criar",
				confirm: async (form) => {
					await this.electron.projects.create(form);
					this.projects.reload();
					this.dialog.closeAll();
				}
			},
			panelOptions: {
				height: "fit-content",
			}
		})
	};
}
