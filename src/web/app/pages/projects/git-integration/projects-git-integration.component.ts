import { Component, effect, inject, input, resource, untracked } from '@angular/core';
import { AutocompleteComponent } from '../../../shared/components/autocomplete/autocomplete.component';
import { AutocompleteOption } from '@shared/models/autocomplete-option';
import { FormBuilder, Validators } from '@angular/forms';
import { InputComponent } from '../../../shared/components/input/input.component';
import { formType } from '../../../shared/utils/form-type';
import { formValueToSignal } from '../../../shared/utils/control-value-to-signal';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { getElectron } from '../../../shared/di/functions/get-electron';
import { GitProvider } from '@shared/models/git-provider';
import { MarkUsed } from '../../../shared/utils/mark-used';

@Component({
  selector: 'app-projects-git-integration',
	imports: [
		AutocompleteComponent,
		InputComponent,
		ButtonComponent,
	],
  templateUrl: './projects-git-integration.component.html',
  styleUrl: './projects-git-integration.component.scss'
})
export class ProjectsGitIntegrationComponent {
	projectId = input.required<string>()

	providers: AutocompleteOption[] = [
		{
			label: "Github",
			value: "github"
		}
	];

	@MarkUsed()
	protected disableFields = effect(() => {
		const connection = this.connection.value();
		const form = this.formValue();

		untracked(() => {
			const {repository, targetBranch, sourceBranch} = this.form.controls;

			if(!connection) {
				repository.disable();
				targetBranch.disable();
				sourceBranch.disable();
				return;
			}

			if(connection.status === 'disconnected') {
				repository.disable();
				targetBranch.disable();
				sourceBranch.disable();
				return;
			}

			if(!form.repository) {
				repository.enable();
				targetBranch.disable();
				sourceBranch.disable();
				return;
			}

			repository.enable();
			targetBranch.enable();
			sourceBranch.enable();
		})
	})


	connection = resource({
		params: this.projectId,
		loader: ({params: projectId}) => this.electron.git.getConnection(projectId),
	})

	repositories = resource({
		params: () => ({connection: this.connection.value(), projectId: this.projectId()}),
		defaultValue: {results: []},
		loader: ({params}) => {
			if(!params.connection) return Promise.resolve({results: []});
			if(params.connection.status === 'disconnected') return Promise.resolve({results: []});

			return this.electron.git.getRepositories(params.projectId);
		}
	});

	branches = resource({
		params: () => ({connection: this.connection.value(), projectId: this.projectId(), form: this.formValue()}),
		defaultValue: {results: []},
		loader: ({params}) => {
			if(!params.connection) return Promise.resolve({results: []});
			if(params.connection.status === 'disconnected') return Promise.resolve({results: []});
			if(!params.form.repository) return Promise.resolve({results: []});

			return this.electron.git.getBranches(params.projectId, params.form.repository);
		}
	});

	form = inject(FormBuilder).nonNullable.group({
		provider: [formType<GitProvider>('github'), Validators.required],
		repository: [formType.required<string>(), Validators.required],
		accessToken: [formType.required<string>(), Validators.required],
		sourceBranch: [formType.required<string>(), Validators.required],
		targetBranch: [formType.required<string>(), Validators.required],
	});

	private formValue = formValueToSignal(this.form, {checkEquality: true});
	private electron = getElectron();

	protected async connect() {
		const value = this.formValue();

		await this.electron.git.connect({
			projectId: this.projectId(),
			token: value.accessToken,
			provider: value.provider
		});

		this.connection.reload();
	}
}
