import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  effect,
  ElementRef,
  inject,
  TemplateRef,
  untracked,
} from '@angular/core';
import { NavbarService } from '../navbar.service';

@Component({
  selector: 'app-navbar-place',
  imports: [],
  templateUrl: './navbar-place.component.html',
  styleUrl: './navbar-place.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarPlaceComponent {
  a = contentChild('right', { read: TemplateRef });
  service = inject(NavbarService);

  b = effect(() => {
    const rightTemplate = this.a();

    untracked(() => {
      if (rightTemplate) this.service.registerTemplate('right', rightTemplate);
    });
  });
}
