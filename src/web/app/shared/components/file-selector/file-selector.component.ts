import { Component, effect, input, signal, untracked } from '@angular/core';
import { DragAndDropDirective } from '../../directives/drag-and-drop.directive';
import { MarkUsed } from '../../utils/mark-used';
import { getElectron } from '../../di/functions/get-electron';
import { FktIconComponent, SignalFormControl } from '@frakton-ng/core';

@Component({
	selector: 'app-file-selector',
	imports: [DragAndDropDirective, FktIconComponent],
	templateUrl: './file-selector.component.html',
	styleUrl: './file-selector.component.scss',
})
export class FileSelectorComponent {
	electron = getElectron();
	control = input.required<SignalFormControl<string>>();
	label = input('');
	multiple = input(true);

	files = signal<string[]>([]);

	@MarkUsed()
	updateFiles = effect(() => {
		const value = this.control().value();

		this.files.set(value ? [value] : []);
	});

	@MarkUsed()
	updateControl = effect(() => {
		const files = this.files();

		untracked(() => {
			const controlValue = this.control().value() ?? null;
			const file = files[0] ?? null;

			if (controlValue === file) return;

			this.control().setValue(file);
		});
	});

	protected async select() {
		const file = await this.electron.files.openDialog();

		if (!file) return;

		if (!this.multiple()) {
			this.files.set([file]);
			return;
		}

		this.files.update(all => [...all, file]);
	}

	protected onDrop(files: File[]) {
		const file = files[0] as unknown as { path: string };

		if (!this.multiple()) {
			this.files.set([file.path]);
			return;
		}

		this.files.update(all => [...all, file.path]);
	}

	protected removeFile(file: string) {
		this.files.update(all =>
			all.filter(existentFile => existentFile !== file),
		);
	}
}
