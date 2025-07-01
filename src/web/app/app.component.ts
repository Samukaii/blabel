import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TitleBarComponent } from './core/components/title-bar/title-bar.component';

@Component({
	selector: 'app-root',
  imports: [RouterOutlet, TitleBarComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {}
