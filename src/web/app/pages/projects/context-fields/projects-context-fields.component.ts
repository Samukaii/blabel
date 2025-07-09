import { Component, inject, input, output, resource } from '@angular/core';
import { Project } from '@shared/models/project';
import { TableComponent } from '../../../shared/components/table/table.component';
import { DialogService } from '../../../shared/components/dialog/dialog.service';
import { getElectron } from '../../../shared/di/functions/get-electron';
import { ButtonAction } from '../../../shared/components/button/models/button-action';
import { NoResults } from '../../../shared/models/no-results';
import { TableColumnFn } from '../../../shared/components/table/models/table-column-fn';
import { TableActionFn } from '../../../shared/components/table/models/table-action-fn';
import { ProjectContextField } from '@shared/models/project-context-field';
import { ProjectsContextFieldsFormComponent } from './form/projects-context-fields-form.component';

@Component({
	selector: 'app-projects-context-fields',
	imports: [TableComponent],
	templateUrl: './projects-context-fields.component.html',
	styleUrl: './projects-context-fields.component.scss',
})
export class ProjectsContextFieldsComponent {
	project = input.required<Project>();
	reload = output();

	private dialog = inject(DialogService);
	private api = getElectron();

	protected response = resource({
		params: this.project,
		defaultValue: { results: [] },
		loader: async ({ params: project }) => {
			return this.api.contextFields.getAll(project.id);
		},
	});

	protected createAction: ButtonAction = {
		icon: 'plus',
		text: 'Adicionar',
		iconPosition: 'left',
		identifier: 'create',
		click: () => {
			this.create();
		},
	};

	protected noResults: NoResults = {
		label: 'Nenhum campo de contexto registrado',
		description: 'Clique em "+ Adicionar" para adicionar um novo campo',
		icon: {
			name: 'queue-list',
			classes: 'size-14 text-gray-500',
		},
	};

	protected columnsFn: TableColumnFn<ProjectContextField> = item => {
		return [
			{
				position: 'label',
				name: 'Nome',
				cell: {
					type: 'default',
					options: {
						value: item.label,
					},
				},
			},
			{
				position: 'description',
				name: 'Descrição',
				cell: {
					type: 'default',
					options: {
						value: item.description,
					},
				},
			},
			{
				position: 'type',
				name: 'Tipo',
				cell: {
					type: 'default',
					options: {
						value: item.type.label,
					},
				},
			},
			{
				position: 'required',
				name: 'Obrigatório',
				cell: {
					type: 'default',
					options: {
						value: item.required ? 'Sim' : 'Não',
						classes: item.required
							? [
									'bg-green-700',
									'w-fit',
									'min-w-16',
									'justify-center',
									'text-center',
									'p-1',
									'rounded-full',
									'text-white',
								]
							: [
									'bg-red-500',
									'w-fit',
									'min-w-16',
									'justify-center',
									'text-center',
									'p-1',
									'rounded-full',
									'text-white',
								],
					},
				},
			},
		];
	};

	protected actionsFn: TableActionFn<ProjectContextField> = item => [
		{
			icon: 'pencil-square',
			name: 'edit',
			classes: ['text-gray-500'],
			condition: true,
			click: () => this.update(item),
		},
		{
			icon: 'trash',
			name: 'remove',
			classes: ['text-red-500'],
			condition: true,
			click: () => this.remove(item),
		},
	];

	protected create() {
		this.dialog.open({
			component: ProjectsContextFieldsFormComponent,
			data: {
				title: 'Adicionar campo de contexto',
				confirmButtonName: 'Adicionar',
				project: this.project(),
				confirm: async form => {
					await this.api.contextFields.create(
						this.project().id,
						form,
					);
					this.response.reload();
					this.dialog.closeAll();
				},
			},
			panelOptions: {
				height: 'fit-content',
			},
		});
	}

	protected update(item: ProjectContextField) {
		this.dialog.open({
			component: ProjectsContextFieldsFormComponent,
			data: {
				title: 'Atualizar campo de contexto',
				contextField: item,
				project: this.project(),
				confirmButtonName: 'Salvar',
				confirm: async form => {
					await this.api.contextFields.updateOne(
						this.project().id,
						item.id,
						form,
					);

					this.response.reload();
					this.dialog.closeAll();
				},
			},
			panelOptions: {
				height: 'fit-content',
			},
		});
	}

	protected async remove(contextField: ProjectContextField) {
		await this.api.contextFields.remove(this.project().id, contextField.id);
		this.response.reload();
	}
}
