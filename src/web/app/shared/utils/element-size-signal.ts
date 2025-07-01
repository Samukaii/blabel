import { DestroyRef, inject, signal, Signal } from '@angular/core';
import { GeometryRect } from '../models/geometry-rect';

interface ElementSizeSignalFunction {
	(element: HTMLElement, options: {startWithNull: true}): Signal<GeometryRect | null>;
	(element: HTMLElement, options?: {startWithNull?: false}): Signal<GeometryRect>;
}

export const elementSizeSignal: ElementSizeSignalFunction = (element, options) => {
	const destroyRef = inject(DestroyRef);

	const size = signal<any>(options?.startWithNull ? null: element.getBoundingClientRect());

	const observer = new ResizeObserver(() => {
		size.set(element.getBoundingClientRect());
	});

	observer.observe(element);

	destroyRef.onDestroy(() => {
		observer.disconnect();
	});

	return size.asReadonly();
};
