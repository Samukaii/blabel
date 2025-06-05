import {Component, computed, input} from '@angular/core';
import { SanitizePipe } from '../../pipes/sanitize.pipe';
import { iconsMapping } from '../../static/icons/icons-mapping';
import { IconName } from '../../models/icon-name';

@Component({
    selector: 'app-icon',
    imports: [
        SanitizePipe
    ],
    templateUrl: './icon.component.html',
    styleUrl: './icon.component.scss'
})
export class IconComponent {
	name = input.required<IconName>();

	icon = computed(() => iconsMapping[this.name()]);
}
