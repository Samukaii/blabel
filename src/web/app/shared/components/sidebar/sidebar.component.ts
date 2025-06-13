import { Component, computed, input, output } from '@angular/core';

@Component({
	selector: 'app-sidebar',
	imports: [],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
	opened = input(false);
	mode = input<'overlay' | 'push'>('push');
	backdropClick = output();

	protected canShowOverlay = computed(() => {
		if(this.mode() === 'push') return false;

		return this.opened();
	});
}
