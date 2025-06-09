import { Component, input } from '@angular/core';
import { AppColor } from '../../models/app-color';

@Component({
	selector: 'app-spinner',
	imports: [],
	templateUrl: './spinner.component.html',
	styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
	size = input(40);
	stroke = input(4);
	color = input<AppColor>('primary');
}
