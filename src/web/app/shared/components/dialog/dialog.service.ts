import { ComponentRef, inject, Injectable } from '@angular/core';
import { DialogAnchorComponent } from './anchor/dialog-anchor.component';
import { DialogOptions } from './models/dialog-options';
import { ElementAnchorService } from '../../services/element-anchor/element-anchor.service';
import { createComponentBindings } from '../../utils/create-component-bindings';

@Injectable({
	providedIn: 'root'
})
export class DialogService {
	private anchorService = inject(ElementAnchorService);
	private dialogs: { componentRef: ComponentRef<any>; anchor: ComponentRef<DialogAnchorComponent> }[] = [];

	open<T>(options: DialogOptions<T>) {
		const anchor = this.anchorService.createAnchor(DialogAnchorComponent, {
			...options?.panelOptions,
			backdropClick: () => {
				anchor.destroy();
				options?.panelOptions?.backdropClick?.();
			},
		});

		const componentRef = anchor.instance.container().createComponent(options.component, {
			bindings: createComponentBindings(options.component, options.data)
		});

		this.dialogs.push({componentRef, anchor})
	}

	closeAll() {
		this.dialogs.forEach(dialog => {
			dialog.anchor.destroy();
		})
	}
}
