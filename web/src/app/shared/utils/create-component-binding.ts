import { Binding, inputBinding, outputBinding, reflectComponentType, signal, Type } from '@angular/core';
import { ComponentData } from '../components/dialog/anchor/dialog-anchor.service';

export const createComponentBinding = <T>(component: Type<T>, bindings: ComponentData<T>) => {
	const result: Binding[] = [];

	const mirror = reflectComponentType(component);

	mirror?.inputs.forEach(input => {
		const name = input.templateName;

		if (name in bindings) {
			const value = bindings[name as keyof typeof bindings];
			result.push(inputBinding(input.templateName, signal(value)));
		}
	})

	mirror?.outputs.forEach(output => {
		const name = output.templateName;

		if (name in bindings) {
			const value = bindings[name as keyof typeof bindings] as unknown as (() => {});
			result.push(outputBinding(output.templateName, value));
		}
	});

	return result;
};
