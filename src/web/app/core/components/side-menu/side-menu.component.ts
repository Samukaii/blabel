import { Component, inject, resource } from '@angular/core';
import { SideMenuService } from './side-menu.service';
import { Router } from '@angular/router';
import { getElectron } from '../../../shared/di/functions/get-electron';
import { FktMenuGroup, FktSideMenuComponent } from '@frakton-ng/core';

@Component({
	selector: 'app-side-menu',
	imports: [FktSideMenuComponent],
	templateUrl: './side-menu.component.html',
	styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent {
	protected service = inject(SideMenuService);
	private electron = getElectron();
	private router = inject(Router);

	currentUser = resource({
		loader: async () => {
			return await this.electron.auth.getCurrentUser();
		},
	});

	groups: FktMenuGroup[] = [
		{
			items: [
				{
					name: 'Traduções',
					icon: 'language',
					path: 'translations',
				},
			],
		},
		{
			name: 'Configurações',
			items: [
				{
					name: 'Idiomas',
					icon: 'globe-alt',
					path: 'languages',
				},
				{
					name: 'Projetos',
					icon: 'archive-box',
					path: 'projects',
				},
				// {
				//   name: "Usuários",
				//   icon: "user-group",
				//   path: "users"
				// },
			],
		},
	];

	protected async logout() {
		await this.electron.auth.logout();
		await this.router.navigate(['/']);
	}
}
