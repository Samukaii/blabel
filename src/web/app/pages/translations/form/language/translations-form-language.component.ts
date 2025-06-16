import { Component, inject, input, OnInit } from "@angular/core";
import { FormBuilder, FormRecord, ReactiveFormsModule, Validators } from "@angular/forms";
import { TextareaComponent } from "../../../../shared/components/textarea/textarea.component";
import { TranslationLanguage } from '@shared/models/translation-language';
import { TranslationEntry } from '@shared/models/translation-entry';

@Component({
    selector: "app-translations-form-language",
    templateUrl: "./translations-form-language.component.html",
    styleUrl: "./translations-form-language.component.scss",
    imports: [ReactiveFormsModule, TextareaComponent]
})
export class TranslationsFormLanguageComponent implements OnInit {
    entry = input<TranslationEntry>();
    language = input.required<TranslationLanguage>();
    form = input.required<FormRecord>();

    private fb = inject(FormBuilder);

    protected control = this.fb.nonNullable.control("", Validators.required);

    ngOnInit() {
        const form = this.form();
        this.control.setValue(this.entry()?.value ?? "");

        form.addControl(this.language().key, this.control);
    }
}
