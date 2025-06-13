import { ChangeDetectionStrategy, Component, input, } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../../models/icon-name';
import { AppColor } from '../../models/app-color';
import { ButtonTheme } from './models/button-theme';

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
