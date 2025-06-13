import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild, } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  imports: [ReactiveFormsModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent {
  control = input.required<FormControl<string>>();
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
