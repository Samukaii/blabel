import { Component, effect, input, output, signal, untracked } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { AutocompleteOption } from '../../models/autocomplete-option';
import { controlValueToSignal } from '../../utils/control-value-to-signal';
import { outsideClickEffect } from '../../utils/outside-click-effect';
import { IconComponent } from '../icon/icon.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NoResults } from '../../models/no-results';


@Component({
	selector: 'app-autocomplete',
	imports: [
		InputComponent,
		IconComponent,
		SpinnerComponent
	],
	templateUrl: './autocomplete.component.html',
	styleUrl: './autocomplete.component.scss',
})
export class AutocompleteComponent {
	control = input.required<FormControl>();
	options = input<AutocompleteOption[]>([])
	noResults = input<NoResults>({
		label: "Sem resultados",
	})
	loading = input(false);

	placeholder = input('');
	label = input('');
	search = output<string>();

	searchControl = new FormControl('', {nonNullable: true});

	controlValue = controlValueToSignal(this.control);

	updateSelectedOption = effect(() => {
		const value = this.controlValue();

		const option = this.options().find(option => option.value === value);

		if(option) this.selectOption(option);
	})

	searchSignal = controlValueToSignal(this.searchControl, {
		debounce: 250,
		defaultToNull: true
	});

	showOverlay = signal(false);

	protected selectedOption = signal<AutocompleteOption | null>(null);

	protected emitSearch = effect(() => {
		const value = this.searchSignal();

		if (value === null) return;

		this.control().setValue(null);


		untracked(() => {
			this.search.emit(value);
		})
	});

	protected closeOverlayOnOutsideClick = outsideClickEffect(() => {
		this.showOverlay.set(false);
	});

	selectOption(option: AutocompleteOption) {
		this.selectedOption.set(option);
		this.search.emit('');
		this.searchControl.setValue(option.label, {emitEvent: false});
		this.control().setValue(option.value);
		this.showOverlay.set(false);
	}
}
