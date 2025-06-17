import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { SideMenuComponent } from './core/components/side-menu/side-menu.component';
import { TitleBarComponent } from "./core/components/title-bar/title-bar.component";

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, NavbarComponent, SideMenuComponent, TitleBarComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {}
