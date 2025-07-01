import { Component, inject, resource } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { SideMenuService } from './side-menu.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuGroup } from '../../../shared/models/menu-group';
import { getElectron } from '../../../shared/di/functions/get-electron';

@Component({
	selector: 'app-side-menu',
	imports: [
		SidebarComponent,
		IconComponent,
		RouterLink,
		RouterLinkActive,
	],
	templateUrl: './side-menu.component.html',
	styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
	protected service = inject(SideMenuService);
	private electron = getElectron();
	private router = inject(Router);

	currentUser = resource({
		loader: () => this.electron.auth.currentUser()
	});

	groups: MenuGroup[] = [
		// {
		// 	items: [
		// 		{
		// 			name: "Traduções",
		// 			icon: "language",
		// 			path: "translations"
		// 		}
		// 	]
		// },
		{
			name: "Configurações",
			items: [
				// {
				// 	name: "Idiomas",
				// 	icon: "language",
				// 	path: "languages"
				// },
				{
					name: "Projetos",
					icon: "archive-box",
					path: "projects"
				},
				// {
				//   name: "Usuários",
				//   icon: "user-group",
				//   path: "users"
				// },
			]
		},
	];

	protected async logout() {
		await this.electron.auth.logout();
		await this.router.navigate(['/']);
	}
}
