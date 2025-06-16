import { Component, effect, input, signal, untracked } from '@angular/core';
import { DragAndDropDirective } from '../../directives/drag-and-drop.directive';
import { FormControl } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { controlValueToSignal } from '../../utils/control-value-to-signal';
import { MarkUsed } from '../../utils/mark-used';
import { getElectron } from '../../di/functions/get-electron';

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
	electron = getElectron();
	control = input.required<FormControl<string>>();
	label = input('')
	multiple = input(true);

	files = signal<string[]>([]);

	controlValue = controlValueToSignal(this.control);

	@MarkUsed()
	updateFiles = effect(() => {
		const value = this.controlValue();

		this.files.set(value ? [value] : []);
	});

	@MarkUsed()
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
		const file = await this.electron.files.openDialog();

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
