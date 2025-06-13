import {Component, computed, input, ViewEncapsulation} from '@angular/core';
import { SanitizePipe } from '../../pipes/sanitize.pipe';
import { iconsMapping } from '../../static/icons/icons-mapping';
import { IconName } from '../../models/icon-name';

@Component({
    selector: 'app-icon',
    imports: [
        SanitizePipe
    ],
    templateUrl: './icon.component.html',
    styleUrl: './icon.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class IconComponent {
	name = input.required<IconName>();
	iconClasses = input("");

    private classSelector = computed(() => {
        return this.iconClasses() ? `class="${this.iconClasses()}"` : "";
    })

	icon = computed(() => iconsMapping[this.name()].replace('<svg', `<svg ${this.classSelector()}`));
}
