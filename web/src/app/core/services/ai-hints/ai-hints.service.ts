import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AiHintsService {
  private http = inject(HttpClient);

  fillWithAi(value: Record<string, any>) {
    return this.http.post(`${environment.api}/ai_hints/fill_empty_languages`, value)
  }
}
