import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Translation } from '../../shared/models/translation';
import { TranslationLanguage } from '../../shared/models/translation-language';
import { TranslationChange } from "../../shared/models/translation-change";


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
    return this.http.post(`${environment.api}/translations/register_change`, {
      translation
    })
  }

  resetChange(translation: {path: string; language: string}) {
    return this.http.patch(`${environment.api}/translations/reset_change`, {
      translation
    });
  }

  saveAll() {
    return this.http.post(`${environment.api}/translations/save_all`, {})
  }
}
