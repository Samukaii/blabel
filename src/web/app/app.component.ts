import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./core/components/navbar/navbar.component";
import { SideMenuComponent } from './core/components/side-menu/side-menu.component';
import { IconComponent } from './shared/components/icon/icon.component';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, NavbarComponent, SideMenuComponent, IconComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent {

	close() {
		window.electronAPI?.windowClose();
	}
	maximize() {
		window.electronAPI?.windowMaximize();

	}
	minimize() {
		window.electronAPI?.windowMinimize();
	}
}
