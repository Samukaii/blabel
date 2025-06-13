import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, ...[
		environment.useHash ? withHashLocation() : []
	].flat()),
    provideClientHydration(withEventReplay()),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch()),
  ]
};
