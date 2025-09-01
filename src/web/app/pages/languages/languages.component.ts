import {
	ChangeDetectionStrategy,
	Component,
	inject,
	resource,
} from '@angular/core';
import { LanguageFileFormComponent } from './form/language-file-form.component';
import { getElectron } from '../../shared/di/functions/get-electron';
import { TranslationFile } from '@shared/models/translation-file';
import {
	FktButtonAction,
	FktDialogService,
	FktNoResults,
	FktTableActionFn,
	FktTableColumnFn,
	FktTableComponent,
} from '@frakton-ng/core';

@Component({
	selector: 'app-languages',
	imports: [FktTableComponent],
	templateUrl: './languages.component.html',
	styleUrl: './languages.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagesComponent {
	private dialog = inject(FktDialogService);
	private api = getElectron();

	protected response = resource({
		defaultValue: { results: [] },
		loader: () => this.api.languages.get(),
	});

	protected noResults: FktNoResults = {
		label: 'Nenhum idioma registrado',
		description: "Clique em '+' para adicionar um novo idioma",
		icon: {
			name: 'globe-alt',
			size: '20px',
		},
	};

	protected columnsFn: FktTableColumnFn<TranslationFile> = item => {
		return [
			{
				position: 'label',
				name: 'Idioma',
				cell: {
					type: 'default',
					options: {
						value: item.name,
						classes: ['font-bold'],
					},
				},
			},
			{
				position: 'path',
				name: 'Arquivo',
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
							'text-sm',
						],
					},
				},
			},
		];
	};

	protected actionsFn: FktTableActionFn<TranslationFile> = item => [
		{
			icon: 'pencil-square',
			identifier: 'edit',
			color: 'primary',
			condition: true,
			theme: 'basic',
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

	createAction: FktButtonAction = {
		text: 'Adicionar idioma',
		icon: 'plus',
		identifier: 'add-language',
		click: () => {
			this.create();
		},
	};

	protected create() {
		this.dialog.open({
			component: LanguageFileFormComponent,
			data: {
				confirmButtonName: 'Adicionar',
				confirm: async form => {
					console.log(form);
					await this.api.languages.add(form);
					this.response.reload();
					this.dialog.closeAll();
				},
			},
			panelOptions: {
				height: 'fit-content',
			},
		});
	}

	protected update(item: TranslationFile) {
		this.dialog.open({
			component: LanguageFileFormComponent,
			data: {
				language: item,
				confirmButtonName: 'Salvar',
				confirm: async form => {
					await this.api.languages.update(item.key, {
						...form,
					});
					this.response.reload();
					this.dialog.closeAll();
				},
			},
			panelOptions: {
				height: 'fit-content',
			},
		});
	}

	protected async remove(language: TranslationFile) {
		await this.api.languages.remove(language.key);
		this.response.reload();
	}
}
