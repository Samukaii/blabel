import { FormGroup } from "@angular/forms";
import { formStatusSignal } from "./form-status-signal";
import { computed } from "@angular/core";

export const formIsValid = (form: FormGroup) => {
  const status = formStatusSignal(form);

  return computed(() => {
    status();

    return form.valid
  })
}
