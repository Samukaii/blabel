import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { getElectron } from '../../shared/di/functions/get-electron';
import {
	FktButtonComponent,
	FktInputComponent,
	SignalFormBuilder,
	SignalValidators,
} from '@frakton-ng/core';
import { LoginPayload } from '@shared/models/payloads/auth-payload';

@Component({
	selector: 'app-login',
	imports: [RouterLink, FktButtonComponent, FktInputComponent],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	form = inject(SignalFormBuilder).strictGroup<LoginPayload>({
		email: ['', [SignalValidators.email(), SignalValidators.required()]],
		password: [
			'',
			[SignalValidators.required(), SignalValidators.minLength(8)],
		],
	});

	private electron = getElectron();
	private router = inject(Router);

	async submit() {
		await this.electron.auth.login(this.form.value());
		await this.router.navigate(['']);
	}
}
