import { Routes } from '@angular/router';
import { TranslationsComponent } from './pages/translations/translations.component';
import { LanguagesComponent } from './pages/languages/languages.component';
import { getElectron } from './shared/di/functions/get-electron';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MainLayoutComponent } from './layouts/main/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { ProjectsComponent } from './pages/projects/projects.component';

export const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		redirectTo: async () => {
			const electronFeatures = getElectron();

			const isLogged = await electronFeatures.auth.isLoggedIn();
			const existsConfiguration = await electronFeatures.languages.get();

			if (!isLogged) return 'auth/login';

			if (existsConfiguration.results.length) return "home/translations";

			return 'home/languages';
		}
	},
	{
		path: "home",
		component: MainLayoutComponent,
		children: [
			{
				path: "translations",
				component: TranslationsComponent
			},
			{
				path: "languages",
				component: LanguagesComponent
			},
			{
				path: "projects",
				loadChildren: () => import('./pages/projects/projects.routes')
			},
		]
	},
	{
		path: "auth",
		component: AuthLayoutComponent,
		children: [
			{
				path: "",
				pathMatch: "full",
				redirectTo: "/auth/login"
			},
			{
				path: "login",
				component: LoginComponent
			},
			{
				path: "register",
				component: RegisterComponent
			},
		]
	},
];
