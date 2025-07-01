import { ChangeDetectionStrategy, Component, computed, ElementRef, input, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FieldErrorComponent } from '../field-error/field-error.component';
import { IconComponent } from '../icon/icon.component';

@Component({
	selector: 'app-input',
	imports: [ReactiveFormsModule, FieldErrorComponent, IconComponent],
	templateUrl: './input.component.html',
	styleUrl: './input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
	control = input.required<FormControl<string>>();
	label = input('');
	type = input<'text' | 'password' | 'number'>('text');
	placeholder = input('');
	spellcheck = input(true);

	protected showPassword = signal(false);

	protected inputType = computed(() => {
		const type = this.type();
		const showPassword = this.showPassword();

		if (type!=='password') return type;

		return showPassword ? 'text':'password';
	});

	public element = viewChild('input', {read: ElementRef});
}
