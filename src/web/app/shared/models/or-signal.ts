import { Signal } from "@angular/core";

export type OrSignal<T> = {
	[K in keyof T]: T[K] | Signal<T[K]>
}
