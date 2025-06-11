import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TableActionFn, TableComponent } from '../../shared/components/table/table.component';
import { TableColumnFn } from '../../shared/components/table/models/table-column-fn';
import { LanguagesService } from './languages.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { LanguageFile } from '../../shared/models/language-file';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { LanguageFileFormComponent } from './form/language-file-form.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { NavbarPlaceComponent } from '../../core/components/navbar/place/navbar-place.component';
import { NoResults } from '../../shared/models/no-results';

@Component({
	selector: 'app-languages',
	imports: [
		TableComponent,
		IconComponent,
		NavbarPlaceComponent
	],
	templateUrl: './languages.component.html',
	styleUrl: './languages.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguagesComponent {
	private service = inject(LanguagesService);
	private dialog = inject(DialogService);

	protected response = rxResource({
		defaultValue: {results: []},
		stream: () => this.service.getAll()
	});

	protected noResults: NoResults = {
		label: "Nenhum idioma registrado",
		description: "Clique em '+' para adicionar um novo idioma",
		icon: {
			name: "globe-alt",
			classes: 'size-14 text-gray-500',
		}
	}

	protected columnsFn: TableColumnFn<LanguageFile> = item => {
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
				value: item.isMain ? "Sim" : "Não",
				classes: item.isMain ? [
					'bg-green-700',
					'w-fit',
					'min-w-16',
					'justify-center',
					'text-center',
					'p-1',
					'rounded-full',
					'text-white',
				] : [
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

	protected actionsFn: TableActionFn<LanguageFile> = item => [
		{
			icon: "pencil-square",
			name: 'edit',
			condition: true,
			click: () => this.update(item),
		}
	]

	protected create() {
		this.dialog.open({
			component: LanguageFileFormComponent,
			data: {
				confirmButtonName: "Adicionar",
				confirm: form => {
					this.service.create(form).subscribe(() => {
						this.response.reload();
						this.dialog.closeAll();
					})
				}
			},
			panelOptions: {
				height: "fit-content",
			}
		})
	}

	protected update(item: LanguageFile) {
		this.dialog.open({
			component: LanguageFileFormComponent,
			data: {
				language: item,
				confirmButtonName: "Salvar",
				confirm: form => {
					this.service.update(form.key, form).subscribe(() => {
						this.response.reload();
						this.dialog.closeAll();
					})
				}
			},
			panelOptions: {
				height: "fit-content",
			}
		})
	}
}
