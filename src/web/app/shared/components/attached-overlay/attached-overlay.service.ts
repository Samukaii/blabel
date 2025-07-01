import { inject, Injectable } from '@angular/core';
import { AttachedOverlayOptions } from './models/attached-overlay-options';
import { AttachedOverlayRef } from './models/attached-overlay-ref';
import { AttachedOverlayComponent } from './anchor/attached-overlay.component';
import { createComponentBindings } from '../../utils/create-component-bindings';
import { ElementAnchorService } from '../../services/element-anchor/element-anchor.service';


@Injectable({
	providedIn: 'root'
})
export class AttachedOverlayService {
	private anchorService = inject(ElementAnchorService);
	private overlays = new Map<string, AttachedOverlayRef<any>>();

	open<T>(options: AttachedOverlayOptions<T>) {
		if (options.panelOptions?.id && !this.canUseId(options.panelOptions.id))
			throw new Error(
				`The overlay id "${options.panelOptions.id}" is already in use. Please choose a different id.`
			);

		const id = options.panelOptions?.id ?? this.createId();

		const anchor = this.anchorService.createAnchor(AttachedOverlayComponent, {
			anchor: options.anchorElementRef,
			id,
			maxHeight: options.panelOptions?.maxHeight ?? 300,
		});

		const componentRef = anchor.instance.container().createComponent(options.component, {
			bindings: createComponentBindings(options.component, options.data)
		});

		const overlayRef: AttachedOverlayRef<T> = {
			componentRef,
			close: () => {
				this.overlays.delete(id);
				anchor.destroy();
				componentRef.destroy();
			}
		};

		this.overlays.set(id, overlayRef);

		return overlayRef;
	}

	private canUseId(id: string) {
		return !this.overlays.has(id);
	}

	private createId() {
		let counter = 1;
		let id = `overlay-container-${counter}`;

		while (!this.canUseId(id)) {
			counter++;
			id = `overlay-container-${counter}`;
		}

		return id;
	}
}
