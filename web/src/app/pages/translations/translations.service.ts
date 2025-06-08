import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Translation } from '../../shared/models/translation';
import { TranslationChange } from "../../shared/models/translation-change";
import { TranslationLanguage } from '../../shared/models/translation-language';
import { TranslationDiff } from '../../shared/models/translation-diff';


@Injectable({
  providedIn: 'root'
})
export class TranslationsService {
  private http = inject(HttpClient);

  getAll(params: { search: string }) {
    return this.http.get<{ results: Translation[]; languages: TranslationLanguage[]; changesCount: number }>(`${environment.api}/translations`, {
      params
    })
  }

  registerChange(translation: TranslationChange) {
    return this.http.post(`${environment.api}/translations/changes`, {
      translation
    })
  }

  getChanges() {
    return this.http.get<{results: TranslationDiff[]}>(`${environment.api}/translations/changes`);
  }

  revertTranslationChange(path: string) {
    return this.http.delete(`${environment.api}/translations/${path}/changes/revert`);
  }

  revertEntryChange(path: string, language: string) {
    return this.http.delete(`${environment.api}/translations/${path}/changes/entries/${language}/revert`);
  }

  registerRemoveChange(path: string) {
    return this.http.post(`${environment.api}/translations/${path}/changes/deletion`, {});
  }

  discardAllChanges() {
    return this.http.delete(`${environment.api}/translations/changes/discard_all`);
  }

  saveAll() {
    return this.http.post(`${environment.api}/translations/changes/save`, {})
  }
}
