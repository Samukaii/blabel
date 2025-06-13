import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
	imports: [
		ReactiveFormsModule
	],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent {
	control = input.required<FormControl>();
	label = input('');
}
