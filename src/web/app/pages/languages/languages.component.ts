import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableColumnFn } from '../../shared/components/table/models/table-column-fn';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { LanguageFileFormComponent } from './form/language-file-form.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { NavbarPlaceComponent } from '../../core/components/navbar/place/navbar-place.component';
import { NoResults } from '../../shared/models/no-results';
import { getElectron } from '../../shared/di/functions/get-electron';
import { TranslationFile } from '@shared/models/translation-file';
import { TableActionFn } from '../../shared/components/table/models/table-action-fn';

@Component({
	selector: 'app-languages',
	imports: [
		TableComponent,
		IconComponent,
		NavbarPlaceComponent,
	],
	templateUrl: './languages.component.html',
	styleUrl: './languages.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguagesComponent {
	private dialog = inject(DialogService);
	private api = getElectron().api;

	protected response = resource({
		defaultValue: {results: []},
		loader: () => this.api.languages.get()
	});

	protected noResults: NoResults = {
		label: "Nenhum idioma registrado",
		description: "Clique em '+' para adicionar um novo idioma",
		icon: {
			name: "globe-alt",
			classes: 'size-14 text-gray-500',
		}
	}

	protected columnsFn: TableColumnFn<TranslationFile> = item => {
		return [
			{
				position: "label",
				name: "Idioma",
				value: item.label,
				classes: [
					'font-bold'
				]
			},
			{
				position: "path",
				name: "Arquivo",
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
			},
			{
				position: "isMain",
				name: "Linguagem principal",
				value: item.isMain ? "Sim":"Não",
				classes: item.isMain ? [
					'bg-green-700',
					'w-fit',
					'min-w-16',
					'justify-center',
					'text-center',
					'p-1',
					'rounded-full',
					'text-white',
				]:[
					'bg-red-500',
					'w-fit',
					'min-w-16',
					'justify-center',
					'text-center',
					'p-1',
					'rounded-full',
					'text-white',
				]
			},
		]
	};

	protected actionsFn: TableActionFn<TranslationFile> = item => [
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
			component: LanguageFileFormComponent,
			data: {
				confirmButtonName: "Adicionar",
				confirm: async (form) => {
					await this.api.languages.add(form)
					this.response.reload();
					this.dialog.closeAll();
				}
			},
			panelOptions: {
				height: "fit-content",
			}
		})
	}

	protected update(item: TranslationFile) {
		this.dialog.open({
			component: LanguageFileFormComponent,
			data: {
				language: item,
				confirmButtonName: "Salvar",
				confirm: async (form) => {
					await this.api.languages.update(item.key, {
						...form
					})
					this.response.reload();
					this.dialog.closeAll();
				}
			},
			panelOptions: {
				height: "fit-content",
			}
		})
	}

	protected async remove(language: TranslationFile) {
		await this.api.languages.remove(language.key);
		this.response.reload();
	}
}
