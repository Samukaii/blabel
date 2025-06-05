import { Component, DOCUMENT, inject, input, OnInit, output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Translation } from "../../../../shared/models/translation";
import { TranslationLanguage } from "../../../../shared/models/translation-language";
import { CallPipe } from "../../../../shared/pipes/call.pipe";
import { TranslationsFormLanguageComponent } from "./language/translations-form-language.component";
import { TranslationChange } from "../../../../shared/models/translation-change";

@Component({
    selector: "app-translations--form",
    templateUrl: "./translations-form.component.html",
    styleUrl: "./translations-form.component.scss",
    imports: [ReactiveFormsModule, TranslationsFormLanguageComponent, CallPipe]
})
export class TranslationsFormComponent implements OnInit {
    title = input.required<string>();
    languages = input.required<TranslationLanguage[]>();
    translation = input<Translation>();
    selectedLanguage = input<TranslationLanguage>();
    submit = output<TranslationChange>();

    private fb = inject(FormBuilder);
    private document = inject(DOCUMENT);

    form = this.fb.nonNullable.group({
        path: ["", Validators.required],
        entries: this.fb.array([
            this.fb.nonNullable.group({
                language: ["", Validators.required],
                value: ["", Validators.required],
            })
        ])
    });

    ngOnInit() {
        this.form.controls.entries.clear();
        this.form.controls.path.setValue(this.translation()?.path ?? "")
    }

    ngAfterViewInit() {
        const selectedLanguage = this.selectedLanguage();

        if (!selectedLanguage) return;

        setTimeout(() => {
            const element = this.document.getElementById(selectedLanguage.key);
            element?.scrollIntoView({
                block: "center",
                inline: "center"
            });
            element?.focus();
        }, 100)
    }

    getEntry(language: TranslationLanguage) {
        return this.translation()?.entries.find(entry => entry.language.key === language.key);
    }

    save() {
        const formValue = this.form.getRawValue();
        this.submit.emit(formValue);
    }
}
