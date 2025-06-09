import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableColumnFn } from '../../shared/components/table/models/table-column-fn';
import { LanguagesService } from './languages.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { LanguageFile } from '../../shared/models/language-file';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { LanguageFileFormComponent } from './form/language-file-form.component';

@Component({
	selector: 'app-languages',
	imports: [
		TableComponent,
		ButtonComponent
	],
	templateUrl: './languages.component.html',
	styleUrl: './languages.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguagesComponent {
	private service = inject(LanguagesService);
	private dialog = inject(DialogService);

	protected response = rxResource({
		defaultValue: {results: []},
		stream: () => this.service.getAll()
	});

	protected columnsFn: TableColumnFn<LanguageFile> = item => {
		return [
			{
				position: "label",
				name: "Idioma",
				value: item.label
			},
			{
				position: "path",
				name: "Arquivo",
				value: item.path
			},
		]
	};
	protected create() {
		this.dialog.open({
			component: LanguageFileFormComponent,
			data: {
				confirm: form => {
					this.service.create(form).subscribe(() => {
						this.response.reload();
					})
				}
			}
		})
	}
}
