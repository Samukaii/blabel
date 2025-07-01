import { Component, computed, contentChild, input, TemplateRef, viewChild } from '@angular/core';
import { IconName } from '../../../models/icon-name';
import { TabLazyDirective } from '../../../directives/tab-lazy.directive';

@Component({
	selector: 'app-tab',
	exportAs: 'appTab',
	imports: [],
	templateUrl: './tab.component.html',
	styleUrl: './tab.component.scss'
})
export class TabComponent {
	label = input.required<string>();
	key = input.required<string>();
	icon = input<IconName>();
	private containerTemplate = viewChild.required('tab', {read: TemplateRef});
	private lazyContent = contentChild(TabLazyDirective);

	template = computed(() => this.lazyContent()?.template ?? this.containerTemplate());
}
