import {
	ChangeDetectionStrategy,
	Component,
	output,
	resource,
} from '@angular/core';
import { getElectron } from '../../../shared/di/functions/get-electron';
import { FktIconComponent } from '@frakton-ng/core';

@Component({
	selector: 'app-translations-review-changes',
	templateUrl: './translations-review-changes.component.html',
	styleUrl: './translations-review-changes.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FktIconComponent],
})
export class TranslationsReviewChangesComponent {
	confirm = output<void>();
	private api = getElectron();

	changes = resource({
		defaultValue: { results: [] },
		loader: () => this.api.translations.getAllChanges(),
	});
}
