import { Component, input, output } from "@angular/core";
import { Translation } from "../../../shared/models/translation";
import { TranslationLanguage } from "../../../shared/models/translation-language";
import { TranslationsTableItemComponent } from "./item/translations-table-item.component";


@Component({
    selector: "app-translations-table",
    templateUrl: "./translations-table.component.html",
    styleUrl: "./translations-table.component.scss",
    imports: [TranslationsTableItemComponent]
})
export class TranslationsTableComponent {
    languages = input.required<TranslationLanguage[]>();
    translations = input.required<Translation[]>()
    edit = output<{ translation: Translation, language: TranslationLanguage }>();
    reset = output<{ path: string, language: string }>();
}
