import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LanguageFile } from '../../shared/models/language-file';
import { InferFormValueFn } from '../../shared/models/infer-form-value-fn';
import { languageFileForm } from './form/language-file-form';
import { AvailableLanguage } from '../../shared/models/available-language';
import { map } from 'rxjs';
import { AutocompleteOption } from '../../shared/models/autocomplete-option';


@Injectable({
	providedIn: 'root'
})
export class LanguagesService {
	private http = inject(HttpClient);
	private baseUrl = `${environment.api}/application_config/languages`;

	getAll() {
		return this.http.get<{ results: LanguageFile[] }>(this.baseUrl);
	}

	getAvailableLanguages(params: { search: string }) {
		return this.http.get<{ results: AvailableLanguage[] }>(`${environment.api}/enumerations/available_languages`, {
			params
		}).pipe(map(({results}) => {
			return results.map((language): AutocompleteOption => ({
				value: language.key,
				label: language.label,
			}))
		}));
	}

	create(payload: InferFormValueFn<typeof languageFileForm>) {
		return this.http.post(this.baseUrl, {language: payload});
	}

	update(key: string, form: Partial<InferFormValueFn<typeof languageFileForm>>) {
		return this.http.patch(`${this.baseUrl}/${key}`, {language: form});
	}
}
