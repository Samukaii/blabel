import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavbarService } from './navbar.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { SideMenuService } from '../side-menu/side-menu.service';

@Component({
	selector: 'app-navbar',
	imports: [IconComponent],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.scss',
	host: {
		ngSkipHydration: "true",
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
	protected service = inject(NavbarService);
	protected sideMenuService = inject(SideMenuService);
}
