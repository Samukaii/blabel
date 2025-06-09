import { Component } from '@angular/core';
import { DragAndDropDirective } from '../../directives/drag-and-drop.directive';

@Component({
  selector: 'app-file-selector',
	imports: [
		DragAndDropDirective
	],
  templateUrl: './file-selector.component.html',
  styleUrl: './file-selector.component.scss'
})
export class FileSelectorComponent {



	select() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'application/json';

		input.click();

		input.addEventListener('change', () => {
			const value = input.value;

			console.log(input.files, value);
		})
	}

	onDrop($event: File[]) {
		console.log($event);
	}
}
