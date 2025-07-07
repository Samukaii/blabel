import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GitProvider } from '@shared/models/git-provider';
import { AutocompleteOption } from '@shared/models/autocomplete-option';
import { GitConnectionResponse } from '@shared/models/responses/git-connection-response';
import { ButtonComponent } from 'web/app/shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { AutocompleteComponent } from '../../../../shared/components/autocomplete/autocomplete.component';
import { formType } from '../../../../shared/utils/form-type';
import { formIsValid } from '../../../../shared/utils/form-is-valid';

@Component({
	selector: 'app-projects-repository-connect',
	imports: [
		AutocompleteComponent,
		ButtonComponent,
		InputComponent,
	],
	templateUrl: './projects-repository-connect.component.html',
	styleUrl: './projects-repository-connect.component.scss'
})
export class ProjectsRepositoryConnectComponent implements OnInit {
	title = input.required<string>();
	confirmButtonName = input.required<string>();
	connection = input<GitConnectionResponse>();

	protected form = inject(FormBuilder).nonNullable.group({
		provider: [formType.required<GitProvider>(), Validators.required],
		accessToken: [formType.required<string>(), Validators.required],
	});
	protected isFormValid = formIsValid(this.form);

	submit = output<ReturnType<typeof this.form['getRawValue']>>()

	protected providers: AutocompleteOption[] = [
		{
			label: "Github",
			value: "github"
		}
	];

	ngOnInit() {
		const connection = this.connection();

		if(!connection) return;

		if(connection.status==='disconnected') return;

		this.form.patchValue(connection.info)
	}

	protected async connect() {
		const value = this.form.getRawValue();

		this.submit.emit(value);
	}
}
