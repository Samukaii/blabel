import { FormGroup } from "@angular/forms";

export type InferFormValue<T extends FormGroup> = ReturnType<T['getRawValue']>;
