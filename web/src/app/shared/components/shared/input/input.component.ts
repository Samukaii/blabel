import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  control = input.required<FormControl<string>>();
  label = input('');
  placeholder = input('');

  private element = viewChild('input', { read: ElementRef });

  focus() {
    const element = this.element()?.nativeElement as
      | HTMLInputElement
      | undefined;

    element?.focus();
  }
}
