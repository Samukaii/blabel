import {
	Binding,
	ComponentRef,
	inject,
	Injectable,
	inputBinding,
	outputBinding,
	reflectComponentType,
	signal,
	Type
} from '@angular/core';
import { ComponentData, DialogAnchorService } from './anchor/dialog-anchor.service';
import { DialogAnchorComponent } from './anchor/dialog-anchor.component';

interface DialogOptions<T> {
	component: Type<T>;
	data: ComponentData<T>;
	panelOptions?: Partial<ComponentData<DialogAnchorComponent>>;
}

@Injectable({
	providedIn: 'root'
})
export class DialogService {
	private anchorService = inject(DialogAnchorService);
	private dialogs: { componentRef: ComponentRef<any>; anchor: ComponentRef<DialogAnchorComponent> }[] = [];

	open<T>(options: DialogOptions<T>) {
		const anchor = this.anchorService.createAnchor({
			...options?.panelOptions,
			backdropClick: () => {
				anchor.destroy();
				options?.panelOptions?.backdropClick?.();
			},
		});

		const componentRef = anchor.instance.container().createComponent(options.component, {
			bindings: this.getBindings(options)
		});

		this.dialogs.push({componentRef, anchor})
	}

	closeAll() {
		this.dialogs.forEach(dialog => {
			dialog.anchor.destroy();
		})
	}

	private getBindings<T>(options?: DialogOptions<T>) {
		const bindings: Binding[] = [];
		const data = options?.data;

		if (!data) return bindings;

		const mirror = reflectComponentType(options.component);

		mirror?.inputs.forEach(input => {
			const name = input.templateName;

			if (name in data) {
				const value = data[name as keyof typeof data];
				bindings.push(inputBinding(input.templateName, signal(value)));
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
}
