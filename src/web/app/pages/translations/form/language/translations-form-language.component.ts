import { Component, inject, input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslationLanguage } from '@shared/models/translation-language';
import { TranslationEntry } from '@shared/models/translation-entry';
import { FktTextareaComponent, SignalFormBuilder, SignalFormGroup, SignalValidators, } from '@frakton-ng/core';
import { Generic } from '@shared/models/generic';

@Component({
	selector: 'app-translations-form-language',
	templateUrl: './translations-form-language.component.html',
	styleUrl: './translations-form-language.component.scss',
	imports: [ReactiveFormsModule, FktTextareaComponent],
})
export class TranslationsFormLanguageComponent implements OnInit {
	entry = input<TranslationEntry>();
	language = input.required<TranslationLanguage>();
	form = input.required<SignalFormGroup<Generic>>();

	private fb = inject(SignalFormBuilder);

	protected control = this.fb.control(['', SignalValidators.required()]);

	ngOnInit() {
		const form = this.form();
		this.control.setValue(this.entry()?.value ?? '');

		form.addControl(this.language().key, this.control);
	}
}
