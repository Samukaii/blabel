import {
	Component,
	effect,
	inject,
	input,
	output,
	resource,
	untracked,
} from '@angular/core';
import { getElectron } from '../../../shared/di/functions/get-electron';
import { MarkUsed } from '../../../shared/utils/mark-used';
import { Project } from '@shared/models/project';
import { ProjectsRepositoryConnectComponent } from './connect/projects-repository-connect.component';
import {
	FktAutocompleteComponent,
	FktButtonComponent,
	FktDialogService,
	FktIconComponent,
	SignalFormBuilder,
	SignalValidators,
} from '@frakton-ng/core';

@Component({
	selector: 'app-projects-repository',
	imports: [FktAutocompleteComponent, FktButtonComponent, FktIconComponent],
	templateUrl: './projects-repository.component.html',
	styleUrl: './projects-repository.component.scss',
})
export class ProjectsRepositoryComponent {
	project = input.required<Project>();
	reload = output();

	protected form = inject(SignalFormBuilder).strictGroup<{
		repository: string;
		sourceBranch: string;
		targetBranch: string;
	}>({
		repository: [null as unknown as string, SignalValidators.required()],
		sourceBranch: [null as unknown as string, SignalValidators.required()],
		targetBranch: [null as unknown as string, SignalValidators.required()],
	});

	private electron = getElectron();
	private dialog = inject(FktDialogService);
	protected preFilled = false;

	@MarkUsed()
	protected patchForm = effect(() => {
		this.form.patchValue(this.project());
		setTimeout(() => {
			this.preFilled = true;
		}, 100);
	});

	@MarkUsed()
	protected clearBranches = effect(() => {
		this.form.controls.repository.value();

		if (!this.preFilled) return;

		untracked(() => {
			const { targetBranch, sourceBranch } = this.form.controls;

			sourceBranch.setValue(null as unknown as string);
			targetBranch.setValue(null as unknown as string);
		});
	});

	@MarkUsed()
	protected disableFields = effect(() => {
		const connection = this.connection.value();
		const form = this.form.value();

		untracked(() => {
			const { repository, targetBranch, sourceBranch } =
				this.form.controls;

			if (!connection) {
				repository.disable();
				targetBranch.disable();
				sourceBranch.disable();
				return;
			}

			if (connection.status === 'disconnected') {
				repository.disable();
				targetBranch.disable();
				sourceBranch.disable();
				return;
			}

			if (!form.repository) {
				repository.enable();
				targetBranch.disable();
				sourceBranch.disable();
				return;
			}

			repository.enable();
			targetBranch.enable();
			sourceBranch.enable();
		});
	});

	protected connection = resource({
		params: this.project,
		loader: ({ params: project }) =>
			this.electron.git.getConnection(project.id),
	});

	protected repositories = resource({
		params: () => ({
			connection: this.connection.value(),
			projectId: this.project().id,
		}),
		defaultValue: { results: [] },
		loader: ({ params }) => {
			if (!params.connection) return Promise.resolve({ results: [] });
			if (params.connection.status === 'disconnected')
				return Promise.resolve({ results: [] });

			return this.electron.git.getRepositories(params.projectId);
		},
	});

	protected branches = resource({
		params: () => ({
			connection: this.connection.value(),
			projectId: this.project().id,
			form: this.form.value(),
		}),
		defaultValue: { results: [] },
		loader: ({ params }) => {
			if (!params.connection) return Promise.resolve({ results: [] });
			if (params.connection.status === 'disconnected')
				return Promise.resolve({ results: [] });
			if (!params.form.repository)
				return Promise.resolve({ results: [] });

			return this.electron.git.getBranches(
				params.projectId,
				params.form.repository,
			);
		},
	});

	protected connect() {
		this.dialog.open({
			component: ProjectsRepositoryConnectComponent,
			data: {
				title: 'Conectar repositório',
				confirmButtonName: 'Conectar',
				submit: async value => {
					await this.electron.git.connect({
						projectId: this.project().id,
						token: value.token,
						provider: value.provider,
					});
					this.connection.reload();
					this.dialog.closeAll();
				},
			},
		});
	}

	protected updateConnection() {
		this.dialog.open({
			component: ProjectsRepositoryConnectComponent,
			data: {
				title: 'Atualizar conexão',
				confirmButtonName: 'Salvar',
				connection: this.connection.value(),
				submit: async value => {
					await this.electron.git.connect({
						projectId: this.project().id,
						token: value.token,
						provider: value.provider,
					});
					this.connection.reload();
					this.dialog.closeAll();
				},
			},
		});
	}

	protected async disconnect() {
		await this.electron.git.disconnect(this.project().id);
		this.connection.reload();
		this.reload.emit();
	}

	protected async submit() {
		await this.electron.projects.updateOne(
			this.project().id,
			this.form.value(),
		);
		this.reload.emit();
	}
}
