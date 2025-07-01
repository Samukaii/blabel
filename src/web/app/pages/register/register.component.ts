import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { InputComponent } from '../../shared/components/input/input.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CustomValidators } from '../../shared/validators/custom-validators';
import { formIsValid } from '../../shared/utils/form-is-valid';
import { getElectron } from '../../shared/di/functions/get-electron';
import { Router, RouterLink } from '@angular/router';

export function createReactiveForm(form: FormGroup) {
  const controls = {} as Record<string, WritableSignal<any>>;

  Object.keys(form.controls).forEach(key => {
    const control = form.get(key)!;
    const sig = signal(control.value);

    control.valueChanges.subscribe(value => sig.set(value));
    effect(() => control.setValue(sig(), { emitEvent: false }));

    controls[key] = sig;
  });

  const value = computed(() => {
    const result: Record<string, any> = {};
    Object.keys(controls).forEach(key => result[key] = controls[key]());
    return result;
  });

  const valid = computed(() => form.valid);

  return {
    controls,
    value,
    valid,
    form,
  };
}

@Component({
  selector: 'app-register',
  imports: [
    InputComponent,
    ButtonComponent,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, CustomValidators.password()]],
    passwordConfirmation: ['', [
      Validators.required,
      CustomValidators.equalConfirmation('password', 'Senhas não coincidem')]
    ],
  });

  protected valid = formIsValid(this.form);
  private electron = getElectron();
  private router = inject(Router);

  async submit() {
    await this.electron.auth.register(this.form.getRawValue());
    await this.router.navigate(['']);
  }
}
