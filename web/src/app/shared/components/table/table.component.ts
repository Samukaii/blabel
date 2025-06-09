import { Component, computed, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { NoResults } from '../../models/no-results';
import { TableColumn } from './models/table-column';
import { TableColumnFn } from './models/table-column-fn';
import { Identifiable } from '../../models/identifiable';


@Component({
	selector: 'app-table',
	imports: [
		IconComponent
	],
	templateUrl: './table.component.html',
	styleUrl: './table.component.scss'
})
export class TableComponent<T extends Identifiable> {
	data = input.required<T[]>()
	columnsFn = input.required<TableColumnFn<T>>();
	loading = input(false);

	noResults = input<NoResults>({
		label: "Sem resultados"
	});

	headers = computed(() => {
		const columnsFn = this.columnsFn();
		const data = this.data();

		if(!data.length) return [] as TableColumn[];

		return columnsFn(this.data()[0]);
	});

	columns = computed(() => {
		const columnsFn = this.columnsFn();
		const data = this.data();

		return data.map(item => columnsFn(item));
	})
}
