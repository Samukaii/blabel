import { Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { NoResults } from '../../models/no-results';
import { TableColumn } from './models/table-column';
import { TableColumnFn } from './models/table-column-fn';
import { Identifiable } from '../../models/identifiable';
import { CallPipe } from '../../pipes/call.pipe';
import { CustomCellRendererComponent } from './cell-renderer/custom-cell-renderer.component';
import { toClassPipe } from '../../pipes/toClass.pipe';
import { SpinnerComponent } from '../spinner/spinner.component';
import { TableActionFn } from './models/table-action-fn';
import { TableClassesFn } from './models/table-classes-fn';


@Component({
	selector: 'app-table',
	imports: [
		IconComponent,
		CallPipe,
		CustomCellRendererComponent,
		toClassPipe,
		SpinnerComponent,
	],
	templateUrl: './table.component.html',
	styleUrl: './table.component.scss'
})
export class TableComponent<T extends Identifiable> {
	data = input.required<T[]>()
	columnsFn = input.required<TableColumnFn<T>>();
	classesFn = input<TableClassesFn<T>>(() => '');
	actionsFn = input<TableActionFn<T>>(() => []);
	loading = input(false);

	createAction = output();

	noResults = input<NoResults>({
		label: "Sem resultados"
	});

	headers = computed(() => {
		const columnsFn = this.columnsFn();
		const data = this.data();

		if (!data.length) return [] as TableColumn[];

		return columnsFn(this.data()[0]);
	});

	columns = computed(() => {
		const columnsFn = this.columnsFn();
		const data = this.data();

		return data.map(item => {
			return {
				item,
				columns: columnsFn(item)
			}
		});
	});

	actions = computed(() => {
		const actionsFn = this.actionsFn();
		const data = this.data();

		return data.map(item => actionsFn(item));
	})
}
