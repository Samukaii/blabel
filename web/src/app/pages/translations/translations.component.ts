import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { IconComponent } from "../../shared/components/icon/icon.component";
import { Translation } from '../../shared/models/translation';
import { TranslationLanguage } from '../../shared/models/translation-language';
import { TranslationsFormComponent } from './form/translations-form.component';
import { TranslationsTableComponent } from './table/translations-table.component';
import { TranslationsSaveService } from './translations-save.service';
import { TranslationsService } from './translations.service';

@Component({
  selector: 'app--translations',
  templateUrl: './translations.component.html',
  styleUrl: './translations.component.scss',
  imports: [ReactiveFormsModule, TranslationsTableComponent, IconComponent],
})
export class TranslationsComponent {
  private service = inject(TranslationsService);
  protected saveService = inject(TranslationsSaveService);
  private dialog = inject(DialogService);

  searchControl = new FormControl("", { nonNullable: true });
  searchControlValue = toSignal(this.searchControl.valueChanges, { initialValue: this.searchControl.value });

  protected response = rxResource({
    params: this.searchControlValue,
    defaultValue: { results: [], languages: [], changesCount: 0 },
    stream: ({ params: search }) => this.service.getAll({ search })
  });

  add() {
    this.dialog.open({
      component: TranslationsFormComponent,
      data: {
        title: "Adicionar tradução",
        languages: this.response.value().languages,
        submit: form => {
          this.service.registerChange(form).subscribe(() => {
            this.dialog.closeAll();
            this.response.reload();
          });
        }
      }
    });
  }

  reset(change: { path: string; language: string }) {
    this.service.revertEntryChange(change.path, change.language).subscribe(() => {
      this.response.reload();
    })
  }

  saveAll() {
    this.service.saveAll().subscribe(() => {
      this.response.reload();
    })
  }

  discardAll() {
    this.service.discardAllChanges().subscribe(() => {
      this.response.reload();
    })
  }

  update($event: { translation: Translation; language: TranslationLanguage; }) {
    this.dialog.open({
      component: TranslationsFormComponent,
      data: {
        title: "Editar tradução",
        languages: this.response.value().languages,
        selectedLanguage: $event.language,
        translation: $event.translation,
        submit: form => {
          this.service.registerChange(form).subscribe(() => {
            this.dialog.closeAll();
            this.response.reload();
          })
        }
      }
    });
  }

  remove(path: string) {
    this.service.registerRemoveChange(path).subscribe(() => {
      this.response.reload();
    })
  }

  revertTranslation(path: string) {
    this.service.revertTranslationChange(path).subscribe(() => {
      this.response.reload();
    })
  }
}
