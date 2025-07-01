import {
	Component,
	computed,
	effect,
	ElementRef,
	inject,
	input,
	output,
	signal,
	viewChild,
	ViewContainerRef
} from '@angular/core';
import { GeometryAlignmentService } from '../../../services/geometry-alignment/geometry-alignment.service';
import { MarkUsed } from '../../../utils/mark-used';
import { elementSizeSignal } from '../../../utils/element-size-signal';


@Component({
	selector: 'app-dropdown-host',
	template: `
		<div class="overlay-container">
			<ng-template #container></ng-template>
		</div>`,
	styles: `
		:host {
			position: absolute;
			z-index: 9999;
			height: fit-content;
			opacity: 0;
		}

		.overlay-container {
			min-width: var(--min-width, 200px);
			max-height: var(--max-height, 300px);
			overflow: auto;
			background: white;
			border: 1px solid #ccc;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
			border-radius: 4px;
		}
	`,
	standalone: true,
	host: {
		'[style.opacity]': 'canShow() ? 1 : 0',
		'[style.left.px]': 'alignedPosition()?.x ?? 0',
		'[style.top.px]': 'alignedPosition()?.y ?? 0',
		'[style.width]': 'width()',
		'[style.--max-height]': 'maxHeight() + "px"',
		'[id]': 'id()'
	}
})
export class AttachedOverlayComponent {
	container = viewChild.required('container', {read: ViewContainerRef})

	id = input.required<string>();
	anchor = input.required<ElementRef>();
	spacing = input(16);
	maxHeight = input(300);
	closeClick = output();
	private alignmentService = inject(GeometryAlignmentService);

	private elementRef = inject(ElementRef);

	protected sizeSignal = elementSizeSignal(this.elementRef.nativeElement, {startWithNull: true});
	protected canShow = signal(false);
	protected width = computed(() => `${this.anchor().nativeElement.getBoundingClientRect().width}px`);

	protected alignedPosition = computed(() => {
		const anchor = this.anchor() as ElementRef<HTMLElement>;

		const anchorRect = anchor.nativeElement.getBoundingClientRect();
		const size = this.sizeSignal();

		if(!size) return null;

		const {result} = this.alignmentService.smartAlignTargetTo({
			anchor: anchorRect,
			targetSize: size,
			preferredPositions: ['bottom-center'],
		})

		return result;
	});

	@MarkUsed()
	protected updateVisibility = effect(() => {
		if(this.sizeSignal()) {
			setTimeout(() => {
				this.canShow.set(true);
			}, 100)
		}
	});
}
