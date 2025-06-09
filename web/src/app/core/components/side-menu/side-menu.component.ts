import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { SideMenuService } from './side-menu.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuGroup } from '../../../shared/models/menu-group';

@Component({
	selector: 'app-side-menu',
	imports: [
		SidebarComponent,
		IconComponent,
		RouterLink,
		RouterLinkActive
	],
	templateUrl: './side-menu.component.html',
	styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
	protected service = inject(SideMenuService);

	groups: MenuGroup[] = [
		{
			items: [
				{
					name: "Traduções",
					icon: "language",
					path: "translations"
				}
			]
		},
		{
			name: "Configurações",
			items: [
				{
					name: "Idiomas",
					icon: "globe-alt",
					path: "languages"
				},
			]
		},
	];
}
