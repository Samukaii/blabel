import {Component, inject, input, output, resource} from '@angular/core';
import {Project} from '@shared/models/project';
import {DialogService} from '../../../shared/components/dialog/dialog.service';
import {getElectron} from '../../../shared/di/functions/get-electron';
import {NoResults} from '../../../shared/models/no-results';
import {TableColumnFn} from '../../../shared/components/table/models/table-column-fn';
import {TableActionFn} from '../../../shared/components/table/models/table-action-fn';
import {TableComponent} from '../../../shared/components/table/table.component';
import {ButtonAction} from '../../../shared/components/button/models/button-action';
import {ProjectsLanguagesFileFormComponent} from './form/projects-languages-file-form.component';
import {ProjectLanguage} from "@shared/models/project-language";

@Component({
	selector: 'app-projects-languages',
	imports: [TableComponent],
	templateUrl: './projects-languages.component.html',
	styleUrl: './projects-languages.component.scss'
})
export class ProjectsLanguagesComponent {
	project = input.required<Project>();
	reload = output();

	private dialog = inject(DialogService);
	private api = getElectron();

	protected response = resource({
		params: this.project,
		defaultValue: {results: []},
		loader: ({params: project}) => this.api.projectLanguages.getAll(project.id)
	});

	protected createAction: ButtonAction = {
		icon: "plus",
		text: "Adicionar",
		iconPosition: 'left',
		identifier: "create",
		click: () => {
			this.create();
		}
	}

	protected noResults: NoResults = {
		label: "Nenhum idioma registrado",
		description: "Clique em '+' para adicionar um novo idioma",
		icon: {
			name: "globe-alt",
			classes: 'size-14 text-gray-500',
		}
	}

	protected columnsFn: TableColumnFn<ProjectLanguage> = item => {
		return [
			{
				position: "label",
				name: "Idioma",
				cell: {
					type: 'default',
					options: {
						value: item.name,
						classes: [
							'font-bold'
						]
					}
				}
			},
			{
				position: "path",
				name: "Arquivo",
				cell: {
					type: 'default',
					options: {
						value: item.path,
						classes: [
							'bg-gray-100',
							'truncate',
							'p-2',
							'rounded-full',
							'w-fit',
							'max-w-full',
							'drop-shadow',
							'shadow-md',
							'font-medium',
							'text-sm'
						]
					}
				}
			},
		]
	};

	protected actionsFn: TableActionFn<ProjectLanguage> = item => [
		{
			icon: "pencil-square",
			name: 'edit',
			classes: ['text-gray-500'],
			condition: true,
			click: () => this.update(item),
		},
		{
			icon: "trash",
			name: 'remove',
			classes: ['text-red-500'],
			condition: true,
			click: () => this.remove(item),
		},
	]

	protected create() {
		this.dialog.open({
			component: ProjectsLanguagesFileFormComponent,
			data: {
				title: "Adicionar idioma",
				confirmButtonName: "Adicionar",
				project: this.project(),
				confirm: async (form) => {
					await this.api.projectLanguages.create(this.project().id, form)
					this.response.reload();
					this.dialog.closeAll();
				}
			},
			panelOptions: {
				height: "fit-content",
			}
		})
	}

	protected update(item: ProjectLanguage) {
		this.dialog.open({
			component: ProjectsLanguagesFileFormComponent,
			data: {
				title: "Atualizar idioma",
				language: item,
				project: this.project(),
				confirmButtonName: "Salvar",
				confirm: async (form) => {
					await this.api.projectLanguages.updateOne(this.project().id, item.id, form)
					this.response.reload();
					this.dialog.closeAll();
				}
			},
			panelOptions: {
				height: "fit-content",
			}
		})
	}

	protected async remove(language: ProjectLanguage) {
		await this.api.projectLanguages.remove(this.project().id, language.id);
		this.response.reload();
	}
}
