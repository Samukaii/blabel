import { Prettify } from "./prettify";
import { ComponentInputs } from "./component-inputs";
import { ComponentOutputs } from "./component-outputs";

export type ComponentData<T> = Prettify<ComponentInputs<T> & Partial<ComponentOutputs<T>>>;
