import { Component, computed, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { NoResults } from '../../shared/models/no-results';
import { Translation } from '../../shared/models/translation';
import { TranslationLanguage } from '../../shared/models/translation-language';
import { TranslationsFormComponent } from './form/translations-form.component';
import { TranslationsService } from './translations.service';
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

@Component({
	selector: 'app--translations',
	templateUrl: './translations.component.html',
	styleUrl: './translations.component.scss',
	imports: [
		ReactiveFormsModule,
		ButtonComponent,
		TableComponent,
		IconComponent,
		NavbarPlaceComponent
	],
})
export class TranslationsComponent {
	private service = inject(TranslationsService);
	private dialog = inject(DialogService);

	searchControl = new FormControl('', {nonNullable: true});
	searchControlValue = toSignal(this.searchControl.valueChanges.pipe(debounceTime(200)), {
		initialValue: this.searchControl.value,
	});

	protected response = rxResource({
		params: this.searchControlValue,
		defaultValue: {results: [], languages: [], changesCount: 0},
		stream: ({params: search}) => this.service.getAll({search}),
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
				submit: (form) => {
					this.service.registerChange(form).subscribe(() => {
						this.dialog.closeAll();
						this.response.reload();
					});
				},
			},
		});
	}

	reset(path: string, language: string) {
		this.service
			.revertEntryChange(path, language)
			.subscribe(() => {
				this.response.reload();
			});
	}

	reviewChanges() {
		this.dialog.open({
			component: TranslationsReviewChangesComponent,
			data: {
				confirm: () => {
					this.dialog.closeAll();
					this.saveAll();
				}
			}
		})
	}

	saveAll() {
		this.service.saveAll().subscribe(() => {
			this.response.reload();
		});
	}

	discardAll() {
		this.service.discardAllChanges().subscribe(() => {
			this.response.reload();
		});
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
				submit: (form) => {
					this.service.registerChange(form).subscribe(() => {
						this.dialog.closeAll();
						this.response.reload();
					});
				},
			},
		});
	}

	remove(path: string) {
		this.service.registerRemoveChange(path).subscribe(() => {
			this.response.reload();
		});
	}

	revertTranslation(path: string) {
		this.service.revertTranslationChange(path).subscribe(() => {
			this.response.reload();
		});
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
							entry.status === "edited" ? "font-bold" : ""
						]
					},
					actions: [
						{
							icon: "arrow-turn-left",
							click: () => this.reset(element.path, entry.language.key),
							condition: entry.status === "edited",
							classes: ['text-yellow-500']
						},
						{
							icon: "pencil-square",
							condition: entry.status !== "edited",
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
			condition: translation.operation !== "delete",
			classes: ['text-red-500'],
			click: () => {
				this.remove(translation.path);
			}
		},
		{
			icon: "arrow-turn-left",
			name: "revert",
			condition: translation.operation === "delete",
			classes: ['text-yellow-700'],
			click: () => {
				this.revertTranslation(translation.path);
			}
		},
	];

	classesFn: TableClassesFn<Translation> = item => {
		if (item.operation === 'create') return 'bg-green-50 transition hover:bg-green-100';
		if (item.operation === 'delete') return 'bg-red-50 transition hover:bg-red-100';
		if (item.operation === 'edit') return 'bg-blue-50 transition hover:bg-blue-100';

		return '';
	}
}
