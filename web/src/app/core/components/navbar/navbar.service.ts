import { Injectable, signal, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  templates = signal<Record<string, TemplateRef<any>>>({});

  registerTemplate(location: string, template: TemplateRef<any>) {
    this.templates.update(all => ({...all, [location]: template}));
  }
}
