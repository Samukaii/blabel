import { Component, ComponentRef, inject, input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { CustomTableColumn } from '../models/table-column-fn';
import { createComponentBinding } from '../../../utils/create-component-binding';

@Component({
	selector: 'app-custom-cell-renderer',
	imports: [],
	template: '',
	styles: ''
})
export class CustomCellRendererComponent implements OnInit, OnDestroy {
	column = input.required<CustomTableColumn<any>>();

	private viewRef = inject(ViewContainerRef);
	private componentRef: ComponentRef<any> | null = null;

	ngOnInit() {
		const column = this.column();

		this.componentRef = this.viewRef.createComponent(column.component, {
			bindings: createComponentBinding(column.component, column.bindings)
		});
	}

	ngOnDestroy() {
		this.componentRef?.destroy();
	}
}
