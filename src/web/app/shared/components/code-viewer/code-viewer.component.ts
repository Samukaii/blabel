import { Component, computed, input } from '@angular/core';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
	selector: 'app-code-viewer',
	imports: [
		CdkFixedSizeVirtualScroll,
		CdkVirtualForOf,
		CdkVirtualScrollViewport,
	],
	templateUrl: './code-viewer.component.html',
	styleUrl: './code-viewer.component.scss'
})
export class CodeViewerComponent {
	content = input.required<string>();

	protected fileLines = computed(() => this.content().split('\n'));
	protected lineCounterWidth = computed(() => {
		const lines = this.fileLines();
		const width = lines.length.toString().length;

		return `${width * 13}px`;
	});
	protected codeWidth = computed(() => {
		const lines = this.fileLines();
		const width = lines.reduce((acc, line) => Math.max(acc, line.length), 0);

		return `${width * 8}px`;
	})
}
