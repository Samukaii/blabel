import { Component, computed, effect, inject, input, output, signal, untracked, viewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { controlDisabledToSignal, controlValueToSignal } from '../../utils/control-value-to-signal';
import { outsideClickEffect } from '../../utils/outside-click-effect';
import { NoResults } from '../../models/no-results';
import { MarkUsed } from '../../utils/mark-used';
import { AutocompleteOption } from '@shared/models/autocomplete-option';
import { AttachedOverlayService } from '../attached-overlay/attached-overlay.service';
import { AutocompleteOptionsComponent } from './options/autocomplete-options.component';
import { AttachedOverlayRef } from '../attached-overlay/models/attached-overlay-ref';


@Component({
	selector: 'app-autocomplete',
	imports: [
		InputComponent,
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

	protected searchControl = new FormControl('', {nonNullable: true});

	protected controlValue = controlValueToSignal(this.control);
	protected controlDisabled = controlDisabledToSignal(this.control);

	private overlayService = inject(AttachedOverlayService);
	private inputComponent = viewChild.required(InputComponent)

	@MarkUsed()
	protected updateSelectedOption = effect(() => {
		const value = this.controlValue();
		const options = this.options();

		untracked(() => {
			if(value===null) return this.reset();

			const option = options.find(option => option.value===value);

			if (option) this.selectOption(option);
		})
	});

	@MarkUsed()
	protected disableField = effect(() => {
		const controlDisabled = this.controlDisabled();

		untracked(() => {
			if(controlDisabled) this.searchControl.disable({emitEvent: false});
			else this.searchControl.enable({emitEvent: false});
		})
	})

	@MarkUsed()
	protected emitSearch = effect(() => {
		const value = this.searchSignal();

		if (value===null) return;

		this.control().setValue(null);

		untracked(() => {
			this.search.emit(value);
		})
	});

	@MarkUsed()
	protected closeOverlayOnOutsideClick = outsideClickEffect(() => {
		this.closeOverlay();
	}, {excludeIds: ["autocomplete-options-overlay"]});

	protected openOverlay() {
		if(!!this.overlay || this.controlDisabled()) return;

		this.overlay = this.overlayService.open({
			anchorElementRef: this.inputComponent().element(),
			component: AutocompleteOptionsComponent,
			data: {
				options: this.options,
				loading: this.loading,
				selected: computed(() => this.selectedOption()?.value ?? null),
				noResults: this.noResults(),
				select: (option) => {
					this.selectOption(option)
				}
			},
		});
	}

	protected searchSignal = controlValueToSignal(this.searchControl, {
		debounce: 250,
		defaultToNull: true
	});

	private overlay: null | AttachedOverlayRef<AutocompleteOptionsComponent> = null;

	protected selectedOption = signal<AutocompleteOption | null>(null);

	protected selectOption(option: AutocompleteOption) {
		this.selectedOption.set(option);
		this.search.emit('');
		this.searchControl.setValue(option.label, {emitEvent: false});
		this.control().setValue(option.value);
		this.closeOverlay();
	}

	protected reset() {
		this.selectedOption.set(null);
		this.search.emit('');
		this.searchControl.setValue('', {emitEvent: false});
		this.closeOverlay();
	}

	private closeOverlay() {
		this.overlay?.close();
		this.overlay = null;
	}
}
