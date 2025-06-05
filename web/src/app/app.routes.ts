import { Routes } from '@angular/router';
import { TranslationsComponent } from './pages/translations/translations.component';

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "translations"
    },
    {
        path: "translations",
        component: TranslationsComponent
    }
];
