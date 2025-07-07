import { Component, input } from '@angular/core';
import { ButtonAction } from '../button/models/button-action';
import { ButtonComponent } from '../button/button.component';

@Component({
	selector: 'app-buttons-list',
	imports: [
		ButtonComponent
	],
	templateUrl: './buttons-list.component.html',
	styleUrl: './buttons-list.component.scss'
})
export class ButtonsListComponent {
	actions = input.required<ButtonAction[]>()
}
