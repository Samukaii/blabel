import { Prettify } from "./prettify";
import { OrSignal } from "./or-signal";
import { ComponentInputs } from "./component-inputs";
import { ComponentOutputs } from "./component-outputs";

export type ReactiveComponentData<T> = Prettify<OrSignal<ComponentInputs<T>> & Partial<ComponentOutputs<T>>>;
