import { Component, inject } from '@angular/core';
import { CustomValidators } from '../../shared/validators/custom-validators';
import { getElectron } from '../../shared/di/functions/get-electron';
import { Router, RouterLink } from '@angular/router';
import {
	FktButtonComponent,
	FktInputComponent,
	SignalFormBuilder,
	SignalValidators,
} from '@frakton-ng/core';
import { RegisterPayload } from '@shared/models/payloads/auth-payload';

@Component({
	selector: 'app-register',
	imports: [RouterLink, FktInputComponent, FktButtonComponent],
	templateUrl: './register.component.html',
	styleUrl: './register.component.scss',
})
export class RegisterComponent {
	form = inject(SignalFormBuilder).strictGroup<RegisterPayload>({
		name: ['', [SignalValidators.required()]],
		email: ['', [SignalValidators.email(), SignalValidators.required()]],
		password: [
			'',
			[SignalValidators.required(), CustomValidators.password()],
		],
		passwordConfirmation: [
			'',
			[
				SignalValidators.required()
				// CustomValidators.equalConfirmation(
				// 	'password',
				// 	'Senhas não coincidem',
				// ),
			],
		],
	});

	private electron = getElectron();
	private router = inject(Router);

	async submit() {
		await this.electron.auth.register(this.form.value());
		await this.router.navigate(['']);
	}
}
