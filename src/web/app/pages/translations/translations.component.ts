import { Component, computed, inject, resource } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NoResults } from '../../shared/models/no-results';
import { TranslationsFormComponent } from './form/translations-form.component';
import { TranslationsReviewChangesComponent } from './review-changes/translations-review-changes.component';
import { NavbarPlaceComponent } from '../../core/components/navbar/place/navbar-place.component';
import { getElectron } from '../../shared/di/functions/get-electron';
import { AvailableLanguageKey } from '@shared/models/available-languages.js';
import { Translation } from '@shared/models/translation';
import { TranslationLanguage } from '@shared/models/translation-language';
import {
	FktButtonAction,
	FktButtonComponent,
	FktDialogService,
	FktInputComponent,
	FktTableActionFn,
	FktTableClassesFn,
	FktTableColumn,
	FktTableColumnFn,
	FktTableComponent,
	SignalFormControl,
} from '@frakton-ng/core';

@Component({
	selector: 'app-translations',
	templateUrl: './translations.component.html',
	styleUrl: './translations.component.scss',
	imports: [
		ReactiveFormsModule,
		NavbarPlaceComponent,
		FktTableComponent,
		FktInputComponent,
		FktButtonComponent,
	],
})
export class TranslationsComponent {
	private dialog = inject(FktDialogService);
	private api = getElectron();

	searchControl = new SignalFormControl('');

	protected createAction: FktButtonAction = {
		icon: 'plus',
		text: 'Adicionar',
		iconPosition: 'left',
		identifier: 'create',
		click: () => {
			this.add();
		},
	};

	protected response = resource({
		params: this.searchControl.value,
		defaultValue: { results: [], languages: [], changesCount: 0 },
		loader: ({ params: search }) =>
			this.api.translations.getAll({ search }),
	});

	noResults = computed<NoResults>(() => {
		if (!!this.searchControl.value())
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
				confirmButtonName: 'Adicionar',
				languages: this.response.value().languages,
				submit: async form => {
					await this.api.translations.registerChange(form);
					this.dialog.closeAll();
					this.response.reload();
				},
			},
			panelOptions: {
				height: 'fit-content',
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
				},
			},
		});
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
				confirmButtonName: 'Salvar',
				disablePath: true,
				languages: this.response.value().languages,
				selectedLanguage: language,
				translation: translation,
				submit: async form => {
					await this.api.translations.registerChange(form);
					this.dialog.closeAll();
					this.response.reload();
				},
			},
			panelOptions: {
				height: 'fit-content',
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

	columnsFn = computed((): FktTableColumnFn<Translation> => {
		return element => [
			{
				position: 'path',
				name: 'Caminho',
				cell: {
					type: 'default',
					options: {
						value: element.path,
					},
				},
			},
			...element.entries.map(
				(entry): FktTableColumn => ({
					name: entry.language.name,
					position: entry.language.key,
					cell: {
						type: 'with-action',
						options: {
							text: {
								value: entry.value,
								classes: [
									entry.status === 'edited'
										? 'font-bold'
										: '',
								],
							},
							actions: [
								{
									identifier: 'revert',
									icon: 'arrow-uturn-left',
									theme: 'basic',
									click: () =>
										this.reset(
											element.path,
											entry.language.key,
										),
									condition: entry.status === 'edited',
									color: 'yellow',
								},
								{
									identifier: 'edit',
									icon: 'pencil-square',
									theme: 'basic',
									condition: entry.status !== 'edited',
									click: () =>
										this.update(element, entry.language),
									color: 'primary',
								},
							],
						},
					},
				}),
			),
		];
	});

	actionsFn: FktTableActionFn<Translation> = translation => [
		{
			icon: 'minus-circle',
			identifier: 'delete',
			theme: 'basic',
			condition: translation.operation !== 'delete',
			color: 'red',
			click: async () => {
				await this.remove(translation.path);
			},
		},
		{
			icon: 'arrow-uturn-left',
			identifier: 'revert',
			theme: 'basic',
			condition: translation.operation === 'delete',
			color: 'yellow',
			click: async () => {
				await this.revertTranslation(translation.path);
			},
		},
	];

	classesFn: FktTableClassesFn<Translation> = item => {
		if (item.operation === 'create') return 'table-translations-created';
		if (item.operation === 'delete') return 'table-translations-deleted';
		if (item.operation === 'edit') return 'table-translations-updated';

		return '';
	};
}
