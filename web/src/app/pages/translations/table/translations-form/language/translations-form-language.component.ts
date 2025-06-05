import { Component, DOCUMENT, inject, input, OnInit, output } from "@angular/core";
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslationLanguage } from "../../../../../shared/models/translation-language";
import { TranslationEntry } from "../../../../../shared/models/translation-entry";

@Component({
    selector: "app-translations-form-language",
    templateUrl: "./translations-form-language.component.html",
    styleUrl: "./translations-form-language.component.scss",
    imports: [ReactiveFormsModule]
})
export class TranslationsFormLanguageComponent implements OnInit {
    entry = input<TranslationEntry>();
    language = input.required<TranslationLanguage>();
    formArray = input.required<FormArray>();

    private fb = inject(FormBuilder);

    protected form = this.fb.nonNullable.group({
        language: ["", Validators.required],
        value: ["", Validators.required]
    });

    ngOnInit() {
        this.form.patchValue({
            language: this.language().key,
            value: this.entry()?.value
        });

        this.formArray().push(this.form);
    }
}
