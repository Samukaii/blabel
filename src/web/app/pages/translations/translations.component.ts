import { Component, computed, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { NoResults } from '../../shared/models/no-results';
import { TranslationsFormComponent } from './form/translations-form.component';
import { TranslationsReviewChangesComponent } from './review-changes/translations-review-changes.component';
import { ButtonComponent } from "../../shared/components/button/button.component";
import { TableActionFn, TableClassesFn, TableComponent } from '../../shared/components/table/table.component';
import { TableColumnFn } from '../../shared/components/table/models/table-column-fn';
import {
	customTableColumn,
	TranslationsCellsActionComponent
} from '../../shared/components/table/cells/action/translations-cells-action.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { NavbarPlaceComponent } from '../../core/components/navbar/place/navbar-place.component';
import { getElectron } from '../../shared/di/functions/get-electron';
import { AvailableLanguageKey } from '@shared/models/available-languages.js';
import { Translation } from '@shared/models/translation';
import { TranslationLanguage } from '@shared/models/translation-language';

@Component({
	selector: 'app--translations',
	templateUrl: './translations.component.html',
	styleUrl: './translations.component.scss',
	imports: [
		ReactiveFormsModule,
		ButtonComponent,
		TableComponent,
		IconComponent,
		NavbarPlaceComponent,
	],
})
export class TranslationsComponent {
	private dialog = inject(DialogService);
	private api = getElectron().api;

	searchControl = new FormControl('', {nonNullable: true});
	searchControlValue = toSignal(this.searchControl.valueChanges.pipe(debounceTime(200)), {
		initialValue: this.searchControl.value,
	});

	protected response = resource({
		params: this.searchControlValue,
		defaultValue: {results: [], languages: [], changesCount: 0},
		loader: ({params: search}) => this.api.translations.getAll({search}),
	});

	noResults = computed<NoResults>(() => {
		if (!!this.searchControlValue())
			return {
				label: 'Nenhuma tradução encontrada',
				description: 'Tente pesquisar por outro nome',
				icon: {
					name: 'language',
					classes: 'size-14 text-gray-500',
				},
			};

		return {
			label: 'Nenhuma tradução registrada',
			description: 'Vá em "Menu > Idiomas" para adicionar novos idiomas',
			icon: {
				name: 'language',
				classes: 'size-14 text-gray-500',
			},
		};
	});

	add() {
		this.dialog.open({
			component: TranslationsFormComponent,
			data: {
				title: 'Adicionar tradução',
				confirmButtonName: "Adicionar",
				languages: this.response.value().languages,
				submit: async (form) => {
					await this.api.translations.registerChange(form);
					this.dialog.closeAll();
					this.response.reload();
				},
			},
		});
	}

	async reset(path: string, language: AvailableLanguageKey) {
		await this.api.translations.revertEntryChange(path, language);
		this.response.reload();
	}

	reviewChanges() {
		this.dialog.open({
			component: TranslationsReviewChangesComponent,
			data: {
				confirm: async () => {
					await this.saveAll();
					this.dialog.closeAll();
				}
			}
		})
	}

	async saveAll() {
		await this.api.translations.saveAll();
		this.response.reload();
	}

	async discardAll() {
		await this.api.translations.discardAllChanges();
		this.response.reload();
	}

	update(translation: Translation, language: TranslationLanguage) {
		this.dialog.open({
			component: TranslationsFormComponent,
			data: {
				title: 'Editar tradução',
				confirmButtonName: "Salvar",
				disablePath: true,
				languages: this.response.value().languages,
				selectedLanguage: language,
				translation: translation,
				submit: async (form) => {
					await this.api.translations.registerChange(form);
					this.dialog.closeAll();
					this.response.reload();
				},
			},
		});
	}

	async remove(path: string) {
		await this.api.translations.registerRemoveChange(path);
		this.response.reload();
	}

	async revertTranslation(path: string) {
		await this.api.translations.revertTranslationChange(path);
		this.response.reload();
	}

	columnsFn = computed((): TableColumnFn<Translation> => {
		return element => [
			{
				position: "path",
				name: "Caminho",
				value: element.path
			},
			...element.entries.map(entry => customTableColumn({
				component: TranslationsCellsActionComponent,
				name: entry.language.label,
				position: entry.language.key,
				bindings: {
					text: {
						value: entry.value,
						classes: [
							entry.status==="edited" ? "font-bold":""
						]
					},
					actions: [
						{
							icon: "arrow-turn-left",
							click: () => this.reset(element.path, entry.language.key),
							condition: entry.status==="edited",
							classes: ['text-yellow-500']
						},
						{
							icon: "pencil-square",
							condition: entry.status!=="edited",
							click: () => this.update(element, entry.language),
							classes: ['text-blue-900']
						},
					]
				}
			})),
		]
	});

	actionsFn: TableActionFn<Translation> = (translation) => [
		{
			icon: "minus-circle",
			name: "delete",
			condition: translation.operation!=="delete",
			classes: ['text-red-500'],
			click: async () => {
				await this.remove(translation.path);
			}
		},
		{
			icon: "arrow-turn-left",
			name: "revert",
			condition: translation.operation==="delete",
			classes: ['text-yellow-700'],
			click: async () => {
				await this.revertTranslation(translation.path);
			}
		},
	];

	classesFn: TableClassesFn<Translation> = item => {
		if (item.operation==='create') return 'bg-green-50 transition hover:bg-green-100';
		if (item.operation==='delete') return 'bg-red-50 transition hover:bg-red-100';
		if (item.operation==='edit') return 'bg-blue-50 transition hover:bg-blue-100';

		return '';
	}
}
