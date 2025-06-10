import { FormControl } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";
import { debounceTime, Subscription } from 'rxjs';
import { afterRenderEffect, DestroyRef, inject, isSignal, signal, Signal } from '@angular/core';

interface ControlValueToSignal {
	<T>(control: FormControl<T> | Signal<FormControl<T>>, options?: {debounce?: number, defaultToNull?: true}): Signal<T>;
	<T>(control: FormControl<T> | Signal<FormControl<T>>, options: { debounce?: number, defaultToNull: false }): Signal<T | null>;
}

export const controlValueToSignal: ControlValueToSignal = (control, options) => {
	const destroyRef = inject(DestroyRef);

	if(!isSignal(control)) {
		let changes = control.valueChanges;

		if (options?.debounce)
			changes = changes.pipe(debounceTime(options?.debounce));

		if (!!options?.defaultToNull)
			return toSignal(changes, {initialValue: null});

		return toSignal(changes, {initialValue: control.value});
	}

	let sub: Subscription | null = null;
	const controlValue = signal<any | null>(null);

	afterRenderEffect(() => {
		const finalControl = control();

		let changes = finalControl.valueChanges;

		if (options?.debounce)
			changes = changes.pipe(debounceTime(options?.debounce));

		controlValue.set(finalControl.value);

		sub = changes.subscribe(value => {
			controlValue.set(value);
		});
	});

	destroyRef.onDestroy(() => {
		sub?.unsubscribe();
	});

	return controlValue;
};
