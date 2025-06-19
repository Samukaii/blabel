import { Type } from "@angular/core";
import { DialogAnchorComponent } from "../anchor/dialog-anchor.component";
import { ComponentData } from '../../../models/component-data';

export interface DialogOptions<T> {
	component: Type<T>;
	data: ComponentData<T>;
	panelOptions?: Partial<ComponentData<DialogAnchorComponent>>;
}
