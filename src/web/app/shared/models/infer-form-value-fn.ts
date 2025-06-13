import { FormGroup } from "@angular/forms";
import { InferFormValue } from './infer-form-value';

export type InferFormValueFn<T extends (...args: any[]) => FormGroup> = InferFormValue<ReturnType<T>>;
