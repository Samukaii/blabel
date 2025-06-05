import { JsonPipe } from "@angular/common";
import { Component, computed, effect, input, output, signal, untracked } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { IconComponent } from "../../../../shared/components/icon/icon.component";
import { TranslationLanguage } from "../../../../shared/models/translation-language";
import { TranslationEntry } from "../../../../shared/models/translation-entry";

@Component({
    selector: "app-translations-table-item",
    templateUrl: "./translations-table-item.component.html",
    styleUrl: "./translations-table-item.component.scss",
    imports: [IconComponent, ReactiveFormsModule]
})
export class TranslationsTableItemComponent {
    entry = input.required<TranslationEntry>();
    translationChange = output<string>();
    edit = output();
    reset = output();

    protected field = new FormControl("", { nonNullable: true });

    protected fieldValue = toSignal(this.field.valueChanges, { initialValue: this.field.value });

    protected setDefaultValue = effect(() => {
        this.field.setValue(this.entry().value);
    });
}
