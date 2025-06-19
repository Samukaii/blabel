import { Routes } from '@angular/router';
import { TranslationsComponent } from './pages/translations/translations.component';
import { LanguagesComponent } from './pages/languages/languages.component';
import { getElectron } from './shared/di/functions/get-electron';

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
		redirectTo: async () => {
			const electronFeatures = getElectron();

			const existsConfiguration = await electronFeatures.api.languages.get();

			if(existsConfiguration.results.length) return "translations";

			return  'languages';
		}
    },
    {
        path: "translations",
        component: TranslationsComponent
    },
	{
		path: "languages",
		component: LanguagesComponent
	},
];
