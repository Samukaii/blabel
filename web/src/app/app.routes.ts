import { Routes } from '@angular/router';
import { TranslationsComponent } from './pages/translations/translations.component';
import { LanguagesComponent } from './pages/languages/languages.component';

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "translations"
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
