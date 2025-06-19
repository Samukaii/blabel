import { Binding, inputBinding, isSignal, outputBinding, reflectComponentType, signal, Type } from "@angular/core";
import { ReactiveComponentData } from "../models/reactive-component-data";

export const createComponentBindings = <T>(component: Type<T>, data: Partial<ReactiveComponentData<T>>) => {
	const bindings: Binding[] = [];

	const mirror = reflectComponentType(component);

	mirror?.inputs.forEach(input => {
		const name = input.templateName;

		if (name in data) {
			const value = data[name as keyof typeof data];
			bindings.push(inputBinding(input.templateName, isSignal(value) ? value:signal(value)));
		}
	})

	mirror?.outputs.forEach(output => {
		const name = output.templateName;

		if (name in data) {
			const value = data[name as keyof typeof data] as unknown as (() => {});
			bindings.push(outputBinding(output.templateName, value));
		}
	});

	return bindings;
}
