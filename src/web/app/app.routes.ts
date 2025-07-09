import { Routes } from '@angular/router';
import { TranslationsComponent } from './pages/translations/translations.component';
import { LanguagesComponent } from './pages/languages/languages.component';
import { getElectron } from './shared/di/functions/get-electron';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MainLayoutComponent } from './layouts/main/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { SelectProjectComponent } from './pages/select-project/select-project.component';
import { needsProjectGuard } from './core/guards/needs-project.guard';

export const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		redirectTo: async () => {
			const electronFeatures = getElectron();

			const isLogged = await electronFeatures.auth.isLoggedIn();
			const projectIsConfigured = await electronFeatures.projects.isConfigured();
			const existsConfiguration = await electronFeatures.languages.get();

			if (!isLogged) return 'auth/login';

			if(!projectIsConfigured) return "select-project";

			if (existsConfiguration.results.length) return "home/translations";

			return 'home/languages';
		}
	},
	{
		path: "select-project",
		component: SelectProjectComponent
	},
	{
		path: "home",
		component: MainLayoutComponent,
		children: [
			{
				path: "translations",
				canActivate: [needsProjectGuard],
				component: TranslationsComponent
			},
			{
				path: "languages",
				canActivate: [needsProjectGuard],
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
