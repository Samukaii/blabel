import { inject, Injectable } from '@angular/core';
import { GeometryAlignmentService } from '../../services/geometry-alignment/geometry-alignment.service';
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
	private alignmentService = inject(GeometryAlignmentService);

	open<T>(options: AttachedOverlayOptions<T>) {
		const anchor = this.anchorService.createAnchor(AttachedOverlayComponent, {
			...this.getDimensions(options),
			maxHeight: options.panelOptions?.maxHeight ?? 300,
		});

		const componentRef = anchor.instance.container().createComponent(options.component, {
			bindings: createComponentBindings(options.component, options.data)
		});

		return {
			componentRef,
			close: () => {
				anchor.destroy();
				componentRef.destroy();
			}
		} as AttachedOverlayRef<T>;
	}

	private getDimensions<T>(options: AttachedOverlayOptions<T>) {
		const anchorRef = options.anchorElementRef;

		if (!anchorRef) return {width: "200px", height: "300px", x: 0, y: 0};

		const anchorElement = anchorRef.nativeElement;

		const anchorRect = anchorElement.getBoundingClientRect();

		const {result} = this.alignmentService.smartAlignTargetTo({
			anchor: anchorRect,
			targetSize: {
				width: anchorRect.width,
				height: options?.panelOptions?.maxHeight ?? 300,
			},
			preferredPositions: ["bottom-center"]
		});

		return {
			width: `${anchorRect.width}px`,
			x: result.x,
			y: result.y,
		};
	}
}
