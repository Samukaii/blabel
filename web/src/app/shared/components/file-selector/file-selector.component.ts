import { Component, effect, input, signal, untracked } from '@angular/core';
import { DragAndDropDirective } from '../../directives/drag-and-drop.directive';
import { FormControl } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { controlValueToSignal } from '../../utils/control-value-to-signal';

declare global {
	interface Window {
		electronAPI: {
			openFileDialog(): Promise<string | null>;
		};
	}
}

@Component({
	selector: 'app-file-selector',
	imports: [
		DragAndDropDirective,
		IconComponent
	],
	templateUrl: './file-selector.component.html',
	styleUrl: './file-selector.component.scss'
})
export class FileSelectorComponent {
	control = input.required<FormControl<string>>();
	label = input('')
	multiple = input(true);

	files = signal<string[]>([]);

	controlValue = controlValueToSignal(this.control);

	updateFiles = effect(() => {
		const value = this.controlValue();

		this.files.set(value ? [value] : []);
	});

	updateControl = effect(() => {
		const files = this.files();

		untracked(() => {
			const controlValue = this.controlValue() ?? null;
			const file = files[0] ?? null;

			if (controlValue === file) return;

			this.control().setValue(file);
		})
	})

	async select() {
		const file = await window.electronAPI.openFileDialog();

		if (!file) return;

		if (!this.multiple()) {
			this.files.set([file]);
			return;
		}

		this.files.update(all => [...all, file]);
	}

	onDrop(files: File[]) {
		const file = files[0] as unknown as { path: string };

		if (!this.multiple()) {
			this.files.set([file.path]);
			return;
		}

		this.files.update(all => [...all, file.path]);
	}

	removeFile(file: string) {
		this.files.update(all => all.filter(existentFile => existentFile !== file));
	}
}
