import { ChangeDetectionStrategy, Component, output, resource, } from '@angular/core';
import { IconComponent } from "../../../shared/components/icon/icon.component";
import { getElectron } from '../../../shared/di/functions/get-electron';

@Component({
  selector: 'app-translations-review-changes',
  templateUrl: './translations-review-changes.component.html',
  styleUrl: './translations-review-changes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class TranslationsReviewChangesComponent {
  confirm = output<void>();
  private api = getElectron().api;

  changes = resource({
    defaultValue: { results: [] },
    loader: () => this.api.translations.getAllChanges(),
  });
}
