import { Component, input, output, viewChild, ViewContainerRef } from '@angular/core';

@Component({
	selector: 'app-dropdown-host',
	template: `<div class="container"><ng-template #container></ng-template></div>`,
	styles: `
		:host {
			position: absolute;
			z-index: 9999;
			height: fit-content;
		}

		.container {
			min-width: var(--min-width, 200px);
			max-height: var(--max-height, 300px);
			overflow: auto;
			background: white;
			border: 1px solid #ccc;
			box-shadow: 0 2px 8px rgba(0,0,0,0.1);
			border-radius: 4px;
		}
	`,
	standalone: true,
	host: {
		'[style.left.px]': 'x()',
		'[style.top.px]': 'y()',
		'[style.width]': 'width()',
		'[style.--max-height]': 'maxHeight() + "px"'
	}
})
export class AttachedOverlayComponent {
	container = viewChild.required('container', {read: ViewContainerRef})

	x = input(0);
	y = input(0);
	spacing = input(16);
	width = input('200px');
	maxHeight = input(300);
	closeClick = output();
}
