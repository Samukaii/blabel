import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavbarService } from './navbar.service';

@Component({
  selector: 'app-navbar',
  imports: [NgTemplateOutlet],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  host: {
    ngSkipHydration: "true",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  service = inject(NavbarService);
 }
