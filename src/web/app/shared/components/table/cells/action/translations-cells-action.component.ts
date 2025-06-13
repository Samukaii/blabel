import { Component, input } from '@angular/core';
import { CustomTableColumn } from '../../models/table-column-fn';
import { IconComponent } from '../../../icon/icon.component';
import { IconName } from '../../../../models/icon-name';
import { CallPipe } from '../../../../pipes/call.pipe';

export const customTableColumn = <T>(customColumn: CustomTableColumn<T>) =>
	customColumn;


@Component({
	selector: 'app-translations-cells-action',
	imports: [
		IconComponent,
		CallPipe
	],
	templateUrl: './translations-cells-action.component.html',
	styleUrl: './translations-cells-action.component.scss'
})
export class TranslationsCellsActionComponent {
	text = input.required<{
		value: string;
		classes?: string[]
	}>()
	actions = input.required<{
		icon: IconName;
		condition: boolean;
		classes?: string[];
		click: () => void;
	}[]>();


	protected getClasses(classes?: string[]) {
		return classes?.join(' ') ?? '';
	}
}
