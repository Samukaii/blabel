import { TableColumn } from "./table-column";
import { Identifiable } from '../../../models/identifiable';
import { Type } from '@angular/core';
import { ComponentData } from '../../../models/component-data';

export interface CustomTableColumn<Component> {
	component: Type<Component>;
	bindings: ComponentData<Component>;
	position: string;
	name: string;
}

export type TableColumnFn<T extends Identifiable> = (item: T) => (TableColumn | CustomTableColumn<any>)[]
