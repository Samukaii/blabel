import { ChangeDetectionStrategy, Component, computed, input, } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../../models/icon-name';
import { AppColor } from '../../models/app-color';
import { ButtonTheme } from './models/button-theme';
import { ButtonVariant } from './models/button-variant';

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
  variant = input<ButtonVariant>('default');
  icon = input<IconName>();
  iconPosition = input<'left' | 'right'>('right');

  protected classes = computed(() => {
	  let classes = '';

	  classes += `theme-${this.theme()}`;
	  classes += ` color-${this.color()}`;

	  if(this.variant())
		  classes += ` variant-${this.variant()}`;

	  return classes;
  })
}
