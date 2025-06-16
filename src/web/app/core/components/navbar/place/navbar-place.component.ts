import {
	ChangeDetectionStrategy,
	Component,
	contentChild,
	effect,
	inject,
	OnDestroy,
	TemplateRef,
	untracked,
} from '@angular/core';
import { NavbarService } from '../navbar.service';
import { MarkUsed } from '../../../../shared/utils/mark-used';

@Component({
	selector: 'app-navbar-place',
	imports: [],
	templateUrl: './navbar-place.component.html',
	styleUrl: './navbar-place.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarPlaceComponent implements OnDestroy {
	rightTemplateRef = contentChild('right', {read: TemplateRef});
	service = inject(NavbarService);

	@MarkUsed()
	registerTemplates = effect(() => {
		const rightTemplate = this.rightTemplateRef();

		untracked(() => {
			if (rightTemplate) this.service.registerTemplate('right', rightTemplate);
		});
	});

	ngOnDestroy() {
		this.service.unregisterTemplate('right');
	}
}
