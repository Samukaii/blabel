import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./core/components/navbar/navbar.component";
import { SideMenuComponent } from './core/components/side-menu/side-menu.component';
import { IconComponent } from './shared/components/icon/icon.component';
import { getElectron } from './shared/di/functions/get-electron';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, NavbarComponent, SideMenuComponent, IconComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent {
	private electron = getElectron();

	close() {
		this.electron.window.close();
	}
	maximize() {
		this.electron.window.maximize();
	}
	minimize() {
		this.electron.window.minimize();
	}
}
