import {
	AfterViewInit,
	Component,
	computed,
	DOCUMENT,
	inject,
	input,
	OnInit,
	output,
	resource,
	signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CallPipe } from '../../../shared/pipes/call.pipe';
import { TranslationsFormLanguageComponent } from './language/translations-form-language.component';
import { Translation } from '@shared/models/translation';
import { TranslationChange } from '@shared/models/translation-change';
import { TranslationLanguage } from '@shared/models/translation-language';
import { AvailableLanguageKey } from '@shared/models/available-languages.js';
import { getElectron } from '../../../shared/di/functions/get-electron';
import { AiHintsPayload } from '@shared/models/ai-hints-payload';
import {
	FktButtonComponent,
	FktInputComponent,
	FktTextareaComponent,
	SignalFormBuilder,
	SignalValidators,
} from '@frakton-ng/core';
import { Generic } from '@shared/models/generic';

@Component({
	selector: 'app-translations-form',
	templateUrl: './translations-form.component.html',
	styleUrl: './translations-form.component.scss',
	imports: [
		ReactiveFormsModule,
		TranslationsFormLanguageComponent,
		CallPipe,
		FktButtonComponent,
		FktTextareaComponent,
		FktInputComponent,
	],
})
export class TranslationsFormComponent implements OnInit, AfterViewInit {
	title = input.required<string>();
	confirmButtonName = input.required<string>();
	languages = input.required<TranslationLanguage[]>();

	disablePath = input<boolean>();
	translation = input<Translation>();
	selectedLanguage = input<TranslationLanguage>();
	submit = output<TranslationChange>();

	mainLanguage = computed(() => this.languages()[0]);
	otherLanguages = computed(() => this.languages().slice(1));
	requestingAi = signal(false);

	mainLanguageEntry = computed(() => this.getEntry(this.mainLanguage()));

	private fb = inject(SignalFormBuilder);
	private document = inject(DOCUMENT);
	private electronFeatures = getElectron();
	private api = this.electronFeatures;

	private hasIntegratedAi = resource({
		loader: () => this.electronFeatures.aiHints.hasIntegratedAi(),
	});

	form = this.fb.group({
		path: ['', SignalValidators.required()],
		entries: this.fb.strictGroup<Generic>({}),
	});

	aiHintsForm = this.fb.group({
		onlyEmptyFields: [false],
		additionalContext: [''],
	});

	mainLanguageIsFilled = computed(() => {
		const formValue = this.form.value();
		const entries = (formValue as Generic)['entries'] as Generic;

		return !!entries[this.mainLanguage().key];
	});

	canShowAi = computed(() => {
		return !!this.hasIntegratedAi.value() && this.mainLanguageIsFilled();
	});

	ngOnInit() {
		const path = this.form.controls.path;

		path.setValue(this.translation()?.path ?? '');

		if (this.disablePath()) path.disable();
	}

	ngAfterViewInit() {
		const selectedLanguage = this.selectedLanguage();

		if (!selectedLanguage) return;

		setTimeout(() => {
			const element = this.document.getElementById(selectedLanguage.key);
			element?.scrollIntoView({
				block: 'center',
				inline: 'center',
			});
			element?.focus();
		}, 100);
	}

	getEntry = (language: TranslationLanguage) => {
		return this.translation()?.entries.find(
			entry => entry.language.key === language.key,
		);
	};

	getFormValue() {
		const formValue = this.form.value();
		const entries = (formValue as Generic)['entries'] as Generic;

		return {
			path: formValue.path,
			entries: Object.entries(entries).map(([key, value]) => ({
				language: key,
				value: value,
			})),
		};
	}

	save() {
		const formValue = this.form.value();
		const entries = (formValue as Generic)['entries'] as Generic;

		const value = {
			path: formValue.path,
			entries: Object.entries(entries).map(([key, value]) => ({
				language: key as AvailableLanguageKey,
				value: value,
			})),
		};

		this.submit.emit(value);
	}

	async fillWithAi() {
		this.requestingAi.set(true);

		const value = {
			...this.aiHintsForm.value(),
			entries: this.getFormValue().entries as AiHintsPayload['entries'],
		};

		const { result } =
			await this.api.aiHints.translateEmptyLanguages(value);

		this.form.controls.entries.patchValue(result as any);
		this.requestingAi.set(false);
	}
}
