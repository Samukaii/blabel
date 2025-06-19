import {
	ApplicationRef,
	createComponent,
	DOCUMENT,
	EnvironmentInjector,
	inject,
	Injectable,
	Type
} from '@angular/core';
import { ReactiveComponentData } from "../../models/reactive-component-data";
import { createComponentBindings } from "../../utils/create-component-bindings";


@Injectable({providedIn: 'root'})
export class ElementAnchorService {
	private document = inject(DOCUMENT);

	constructor(
		private appRef: ApplicationRef,
		private injector: EnvironmentInjector
	) {
	}

	createAnchor<T>(component: Type<T>, options?: Partial<ReactiveComponentData<T>>) {
		const componentRef = createComponent(component, {
			environmentInjector: this.injector,
			bindings: createComponentBindings(component, options ?? {})
		});

		this.appRef.attachView(componentRef.hostView);

		const el = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
		this.document.body.appendChild(el);

		return componentRef;
	}
}
