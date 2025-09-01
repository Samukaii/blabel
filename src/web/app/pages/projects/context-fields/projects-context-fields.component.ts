import { Component, inject, input, output, resource } from '@angular/core';
import { Project } from '@shared/models/project';
import { getElectron } from '../../../shared/di/functions/get-electron';
import { ProjectContextField } from '@shared/models/project-context-field';
import { ProjectsContextFieldsFormComponent } from './form/projects-context-fields-form.component';
import {
	FktButtonAction,
	FktDialogService,
	FktNoResults,
	FktTableActionFn,
	FktTableColumnFn,
	FktTableComponent,
} from '@frakton-ng/core';

@Component({
	selector: 'app-projects-context-fields',
	imports: [FktTableComponent],
	templateUrl: './projects-context-fields.component.html',
	styleUrl: './projects-context-fields.component.scss',
})
export class ProjectsContextFieldsComponent {
	project = input.required<Project>();
	reload = output();

	private dialog = inject(FktDialogService);
	private api = getElectron();

	protected response = resource({
		params: this.project,
		defaultValue: { results: [] },
		loader: async ({ params: project }) => {
			return this.api.contextFields.getAll(project.id);
		},
	});

	protected createAction: FktButtonAction = {
		icon: 'plus',
		text: 'Adicionar',
		iconPosition: 'left',
		identifier: 'create',
		click: () => {
			this.create();
		},
	};

	protected noResults: FktNoResults = {
		label: 'Nenhum campo de contexto registrado',
		description: 'Clique em "+ Adicionar" para adicionar um novo campo',
		icon: {
			name: 'queue-list',
			size: '20px',
		},
	};

	protected columnsFn: FktTableColumnFn<ProjectContextField> = item => {
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

	protected actionsFn: FktTableActionFn<ProjectContextField> = item => [
		{
			icon: 'pencil-square',
			identifier: 'edit',
			color: 'primary',
			theme: 'basic',
			condition: true,
			click: () => this.update(item),
		},
		{
			icon: 'trash',
			identifier: 'remove',
			color: 'red',
			theme: 'basic',
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
