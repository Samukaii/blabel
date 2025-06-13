import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Translation } from '../../../shared/models/translation';
import { TranslationsService } from '../translations.service';
import { IconComponent } from "../../../shared/components/icon/icon.component";

@Component({
  selector: 'app-translations-review-changes',
  templateUrl: './translations-review-changes.component.html',
  styleUrl: './translations-review-changes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class TranslationsReviewChangesComponent {
  confirm = output<void>();
  private service = inject(TranslationsService);

  changes = rxResource({
    defaultValue: { results: [] },
    stream: () => this.service.getChanges(),
  });

  getOperationLabel(change: Translation) {
    switch (change.operation) {
      case 'create':
        return 'Adição';
      case 'delete':
        return 'Deleção';
      default:
        return 'Edição';
    }
  }
}
