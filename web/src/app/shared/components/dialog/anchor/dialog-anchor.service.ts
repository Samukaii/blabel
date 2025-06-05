import { ApplicationRef, Binding, ComponentRef, createComponent, DOCUMENT, EnvironmentInjector, inject, Injectable, inputBinding, outputBinding, reflectComponentType, signal, ViewContainerRef } from '@angular/core';
import { DialogAnchorComponent } from './dialog-anchor.component';
import { ComponentInputs } from '../../../models/component-inputs';
import { ComponentOutputs } from '../../../models/component-outputs';

export type ComponentData<T> = ComponentInputs<T> & Partial<ComponentOutputs<T>>;

@Injectable({ providedIn: 'root' })
export class DialogAnchorService {
  private document = inject(DOCUMENT);

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {
  }

  createAnchor(options?: ComponentData<DialogAnchorComponent>) {
    const componentRef = createComponent(DialogAnchorComponent, {
      environmentInjector: this.injector,
      bindings: this.getBindings(options)
    });

    this.appRef.attachView(componentRef.hostView);

    const el = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    this.document.body.appendChild(el);

    return componentRef;
  }

  private getBindings(options?: ComponentData<DialogAnchorComponent>) {
    const bindings: Binding[] = [];

    if(!options) return bindings;

    const mirror = reflectComponentType(DialogAnchorComponent);

    mirror?.inputs.forEach(input => {
      const name = input.templateName;

      if (name in options) {
        const value = options[name as keyof typeof options];
        bindings.push(inputBinding(input.templateName, signal(value)));
      }
    })

    mirror?.outputs.forEach(output => {
      const name = output.templateName;

      if (name in options) {
        const value = options[name as keyof typeof options] as (() => void);
        bindings.push(outputBinding(output.templateName, value));
      }
    });

    return bindings;
  }
}