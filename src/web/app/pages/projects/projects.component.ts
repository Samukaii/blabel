import { Component, computed, inject, resource } from '@angular/core';
import { getElectron } from '../../shared/di/functions/get-electron';
import { Project } from '@shared/models/project';
import { ProjectsFormComponent } from './form/projects-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
	FktButtonAction,
	FktDialogService,
	FktTableActionFn,
	FktTableColumnFn,
	FktTableComponent,
} from '@frakton-ng/core';

@Component({
	selector: 'app-projects',
	imports: [FktTableComponent],
	templateUrl: './projects.component.html',
	styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
	private electron = getElectron();
	private dialog = inject(FktDialogService);
	private router = inject(Router);
	private route = inject(ActivatedRoute);

	protected createAction: FktButtonAction = {
		icon: 'plus',
		text: 'Adicionar',
		iconPosition: 'left',
		identifier: 'create',
		click: () => {
			this.create();
		},
	};

	projects = resource({
		defaultValue: { results: [] },
		loader: async () => {
			return await this.electron.projects.getAll();
		},
	});

	columnsFn = computed((): FktTableColumnFn<Project> => {
		return element => [
			{
				position: 'name',
				name: 'Nome',
				cell: {
					type: 'default',
					options: {
						value: element.name,
					},
				},
			},
			{
				position: 'description',
				name: 'Descrição',
				cell: {
					type: 'default',
					options: {
						value: element.description ?? '--',
					},
				},
			},
		];
	});

	actionsFn: FktTableActionFn<Project> = project => [
		{
			icon: 'pencil-square',
			identifier: 'edit',
			theme: 'basic',
			condition: true,
			color: 'primary',
			click: async () => {
				await this.update(project);
			},
		},
		{
			icon: 'trash',
			identifier: 'revert',
			theme: 'basic',
			condition: true,
			color: 'red',
			click: async () => {
				await this.remove(project);
			},
		},
	];

	private async update(project: Project) {
		await this.router.navigate([project.id], {
			relativeTo: this.route,
		});
	}

	private async remove(project: Project) {
		await this.electron.projects.remove(project.id);
		this.projects.reload();
	}

	protected create() {
		this.dialog.open({
			component: ProjectsFormComponent,
			data: {
				title: 'Criar projeto',
				confirmButtonName: 'Criar',
				confirm: async form => {
					await this.electron.projects.create(form);
					this.projects.reload();
					this.dialog.closeAll();
				},
			},
			panelOptions: {
				height: 'fit-content',
			},
		});
	}
}
