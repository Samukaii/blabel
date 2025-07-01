import { Component, inject } from '@angular/core';
import { InputComponent } from '../../shared/components/input/input.component';
import { FormBuilder, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { formIsValid } from '../../shared/utils/form-is-valid';
import { getElectron } from '../../shared/di/functions/get-electron';

@Component({
  selector: 'app-login',
  imports: [
    InputComponent,
    ButtonComponent,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  protected valid = formIsValid(this.form);
  private electron = getElectron();
  private router = inject(Router);

  async submit() {
    await this.electron.auth.login(this.form.getRawValue());
    await this.router.navigate(['']);
  }
}
