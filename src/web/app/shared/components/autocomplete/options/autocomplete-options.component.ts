import { Component, input, output } from '@angular/core';
import { AutocompleteOption } from '@shared/models/autocomplete-option';
import { IconComponent } from '../../icon/icon.component';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { NoResults } from '../../../models/no-results';

@Component({
	selector: 'app-autocomplete-options',
	imports: [
		IconComponent,
		SpinnerComponent
	],
	templateUrl: './autocomplete-options.component.html',
	styleUrl: './autocomplete-options.component.scss',
	host: {
		id: 'autocomplete-options-overlay'
	}
})
export class AutocompleteOptionsComponent {
	options = input.required<AutocompleteOption[]>();
	loading = input<boolean | undefined>(false);
	selected = input<string | number | null>();
	noResults = input<NoResults | undefined>({
		label: "Sem resultados",
	});

	select = output<AutocompleteOption>();
}
