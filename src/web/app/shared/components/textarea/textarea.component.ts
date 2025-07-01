import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild, } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FieldErrorComponent } from '../field-error/field-error.component';

@Component({
  selector: 'app-textarea',
  imports: [ReactiveFormsModule, FieldErrorComponent],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent {
  control = input.required<FormControl<string | null>>();
  label = input('');
  placeholder = input('');

  private element = viewChild('textarea', { read: ElementRef });

  focus() {
    const element = this.element()?.nativeElement as
      | HTMLTextAreaElement
      | undefined;

    element?.focus();
  }
}
