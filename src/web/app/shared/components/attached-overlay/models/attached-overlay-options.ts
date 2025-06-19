import { ElementRef, Type } from "@angular/core";
import { GeometryPosition } from "../../../models/geometry-position";
import { ReactiveComponentData } from '../../../models/reactive-component-data';

export interface AttachedOverlayOptions<T> {
	anchorElementRef?: ElementRef<HTMLElement>;
	component: Type<T>;
	data: ReactiveComponentData<T>;
	panelOptions?: {
		maxHeight?: number;
		position?: GeometryPosition;
	}
}
