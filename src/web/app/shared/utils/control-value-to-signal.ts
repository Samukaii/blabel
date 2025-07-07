import { FormControl, FormGroup, ValidationErrors } from "@angular/forms";
import { debounceTime, Subscription } from 'rxjs';
import { afterRenderEffect, DestroyRef, inject, isSignal, signal, Signal } from '@angular/core';
import { Prettify } from '../models/prettify';
import { deepEqual } from './deep-equal';

interface ControlValueToSignal {
	<T>(control: FormControl<T> | Signal<FormControl<T>>, options?: {debounce?: number, defaultToNull?: true}): Signal<T>;
	<T>(control: FormControl<T> | Signal<FormControl<T>>, options: { debounce?: number, defaultToNull: false }): Signal<T | null>;
}

export const controlValueToSignal: ControlValueToSignal = (control, options) => {
	const destroyRef = inject(DestroyRef);
  const controlValue = signal<any | null>(null);
  let sub: Subscription | null = null;

  const watchFormControl = <T>(control: FormControl<T>) => {
    let changes = control.valueChanges;

    if (options?.debounce)
      changes = changes.pipe(debounceTime(options?.debounce));

    if (!!options?.defaultToNull) controlValue.set(null);
    else controlValue.set(control.value);

    return changes.subscribe(value => {
      controlValue.set(value);
    });
  }

	if(!isSignal(control)) {
		sub = watchFormControl(control);
	}
  else {
    afterRenderEffect(() => {
      sub = watchFormControl(control())
    });
  }

	destroyRef.onDestroy(() => {
		sub?.unsubscribe();
	});

	return controlValue;
};


interface ControlDisabledToSignal {
	<T>(control: FormControl<T> | Signal<FormControl<T>>): Signal<boolean>;
}

export const controlDisabledToSignal: ControlDisabledToSignal = (control) => {
	const destroyRef = inject(DestroyRef);
	const disabled = signal<boolean>(false);
	let sub: Subscription | null = null;

	const watchFormControl = <T>(control: FormControl<T>) => {
		let changes = control.statusChanges;

		return changes.subscribe(() => {
			disabled.set(control.disabled);
		});
	}

	if(!isSignal(control)) {
		sub = watchFormControl(control);
	}
	else {
		afterRenderEffect(() => {
			sub = watchFormControl(control())
		});
	}

	destroyRef.onDestroy(() => {
		sub?.unsubscribe();
	});

	return disabled;
};


interface ControlErrorsToSignal {
	<T>(control: FormControl<T> | Signal<FormControl<T>>): Signal<ValidationErrors | null>;
}

export const controlErrorsToSignal: ControlErrorsToSignal = (control) => {
	const destroyRef = inject(DestroyRef);
	const errors = signal<ValidationErrors | null>(null);
	let sub: Subscription | null = null;

	const watchFormControl = <T>(control: FormControl<T>) => {
		let changes = control.statusChanges;

		errors.set(control.errors);

		return changes.subscribe(() => {
			errors.set(control.errors);
		});
	}

	if(!isSignal(control)) {
		sub = watchFormControl(control);
	}
	else {
		afterRenderEffect(() => {
			sub = watchFormControl(control())
		});
	}

	destroyRef.onDestroy(() => {
		sub?.unsubscribe();
	});

	return errors;
};


interface FormValueToSignal {
	<T extends FormGroup>(control: T | Signal<T>, options?: {debounce?: number, checkEquality?: boolean, defaultToNull?: true}): Signal<Prettify<ReturnType<T['getRawValue']>>>;
	<T extends FormGroup>(control: T | Signal<T>, options: { debounce?: number, checkEquality?: boolean, defaultToNull: false }): Signal<Prettify<ReturnType<T['getRawValue']> | null>>;
}

export const formValueToSignal: FormValueToSignal = (form, options) => {
	const destroyRef = inject(DestroyRef);
	const controlValue = signal<any | null>(null, {
		equal: (a, b) => {
			if(options?.checkEquality === false) return false;

			return deepEqual(a, b);
		}
	});

	let sub: Subscription | null = null;

	const watchFormControl = <T extends FormGroup>(control: T) => {
		let changes = control.valueChanges;

		if (options?.debounce)
			changes = changes.pipe(debounceTime(options?.debounce));

		if (!!options?.defaultToNull) controlValue.set(null);
		else controlValue.set(control.value);

		return changes.subscribe(value => {
			controlValue.set(value);
		});
	}

	if(!isSignal(form)) {
		sub = watchFormControl(form);
	}
	else {
		afterRenderEffect(() => {
			sub = watchFormControl(form())
		});
	}

	destroyRef.onDestroy(() => {
		sub?.unsubscribe();
	});

	return controlValue;
};
