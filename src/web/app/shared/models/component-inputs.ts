import { ComponentInputNames } from "./component-input-names";
import { InputSignal } from "@angular/core";

type ComponentInput<T> = {
	[Key in ComponentInputNames<T>]: T[Key] extends InputSignal<infer InputValue> ? InputValue : never;
}

type ExtractUndefined<T> =  {
	[Key in keyof T]: undefined extends T[Key] ? Key : never;
}[keyof T];

type ExtractNonUndefined<T> =  {
	[Key in keyof T]: undefined extends T[Key] ? never : Key;
}[keyof T];

type RequiredComponentInputs<T> = {
	[Key in ExtractNonUndefined<ComponentInput<T>>]: ComponentInput<T>[Key];
}

type OptionalComponentInputs<T> = {
	[Key in ExtractUndefined<ComponentInput<T>>]?: ComponentInput<T>[Key];
}

export type ComponentInputs<T> = RequiredComponentInputs<T> & OptionalComponentInputs<T>;
