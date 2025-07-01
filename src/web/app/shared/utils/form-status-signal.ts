import { FormGroup } from "@angular/forms";
import { DestroyRef, inject, signal } from "@angular/core";

export const formStatusSignal = <Form extends FormGroup>(formGroup: Form) => {
  const destroyRef = inject(DestroyRef);

  const statusSignal = signal(formGroup.status);

  const subscription = formGroup.statusChanges.subscribe(status => {
    statusSignal.set(status);
  });

  destroyRef.onDestroy(() => {
    subscription.unsubscribe();
  });

  return statusSignal;
}
