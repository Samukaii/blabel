import { Component, inject, input, OnInit, output } from '@angular/core';
import { AutocompleteOption } from '@shared/models/autocomplete-option';
import { GitConnectionResponse } from '@shared/models/responses/git-connection-response';
import {
	FktAutocompleteComponent,
	FktButtonComponent,
	FktInputComponent,
	SignalFormBuilder,
	SignalValidators,
} from '@frakton-ng/core';
import { GitConnectPayload } from '@shared/models/payloads/git-connect-payload';

@Component({
	selector: 'app-projects-repository-connect',
	imports: [FktButtonComponent, FktInputComponent, FktAutocompleteComponent],
	templateUrl: './projects-repository-connect.component.html',
	styleUrl: './projects-repository-connect.component.scss',
})
export class ProjectsRepositoryConnectComponent implements OnInit {
	title = input.required<string>();
	confirmButtonName = input.required<string>();
	connection = input<GitConnectionResponse>();

	protected form = inject(SignalFormBuilder).strictGroup<
		Omit<GitConnectPayload, 'projectId'>
	>({
		provider: [null as any, SignalValidators.required()],
		token: ['', SignalValidators.required()],
	});

	submit = output<Omit<GitConnectPayload, 'projectId'>>();

	protected providers: AutocompleteOption[] = [
		{
			label: 'Github',
			value: 'github',
		},
	];

	ngOnInit() {
		const connection = this.connection();

		if (!connection) return;

		if (connection.status === 'disconnected') return;

		this.form.patchValue(connection.info);
	}

	protected async connect() {
		const value = this.form.value();

		this.submit.emit(value);
	}
}
