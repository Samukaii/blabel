import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { IconComponent } from '../../icon/icon.component';
import { IconName } from '../../../models/icon-name';

type ButtonTheme = 'raised' | 'stroked';
type AppColor = 'red' | 'primary' | 'yellow';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class ButtonComponent {
  loading = input(false);
  disabled = input(false);
  text = input('');
  loadingText = input('');
  color = input<AppColor>('primary');
  theme = input<ButtonTheme>('raised');
  icon = input<IconName>();
}
