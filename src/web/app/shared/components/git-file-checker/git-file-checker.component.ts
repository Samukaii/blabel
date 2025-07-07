import { Component, computed, effect, input, output, resource, signal } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CodeViewerComponent } from '../code-viewer/code-viewer.component';
import { getElectron } from '../../di/functions/get-electron';
import { Project } from '@shared/models/project';
import { GitIntegrationFile } from '@shared/models/git-integration-file';
import { IconComponent } from '../icon/icon.component';
import { MarkUsed } from '../../utils/mark-used';

@Component({
  selector: 'app-git-file-checker',
	imports: [
		ButtonComponent,
		CodeViewerComponent,
		IconComponent,
	],
  templateUrl: './git-file-checker.component.html',
  styleUrl: './git-file-checker.component.scss'
})
export class GitFileCheckerComponent {
	project = input.required<Project>();
	file = input.required<string>();
	result = output<GitIntegrationFile>();

	private api = getElectron();

	protected isFirst = signal(true);

	protected response = resource({
		defaultValue: {status: "not-checked"},
		loader: async () => {
			if(this.isFirst()) return {status: "not-checked"} as GitIntegrationFile;

			return this.api.git.findFile(this.project().id, this.file());
		}
	});

	@MarkUsed()
	protected updateResult = effect(() => {
		this.result.emit(this.response.value());
	});

	@MarkUsed()
	protected reset = effect(() => {
		this.file();

		this.response.set({status: "not-checked"});
	});

	protected status = computed(() => this.response.value().status);
	protected content = computed(() => this.response.value().result?.content);
	protected downloadUrl = computed(() => this.response.value().result?.downloadUrl);

	protected async findFile() {
		this.isFirst.set(false);
		this.response.reload();
	}
}
