import { ComponentInputs } from '../../../models/component-inputs';
import { ButtonComponent } from '../button.component';
import { Prettify } from '../../../models/prettify';

export type ButtonAction = Prettify<Partial<ComponentInputs<ButtonComponent>> & {identifier: string; click?: () => void}>;
