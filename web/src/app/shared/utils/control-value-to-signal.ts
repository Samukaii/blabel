import { FormControl } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";
import { debounceTime } from 'rxjs';
import { Signal } from '@angular/core';

interface ControlValueToSignal {
	<T>(control: FormControl<T>, options?: {debounce?: number, defaultToNull?: true}): Signal<T>;
	<T>(control: FormControl<T>, options: { debounce?: number, defaultToNull: false }): Signal<T | null>;
}

export const controlValueToSignal: ControlValueToSignal = (control, options) => {
	let changes = control.valueChanges;

	if (options?.debounce)
		changes = changes.pipe(debounceTime(options?.debounce));

	if (!!options?.defaultToNull)
		return toSignal(changes, {initialValue: null});

	return toSignal(changes, {initialValue: control.value});
};
