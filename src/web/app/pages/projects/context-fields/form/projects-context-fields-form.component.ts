import {
	Component,
	computed,
	inject,
	input,
	OnInit,
	output,
	signal,
} from '@angular/core';
import { Project } from '@shared/models/project';
import { ProjectContextField } from '@shared/models/project-context-field';
import { AutocompleteOption } from '@shared/models/autocomplete-option';
import {
	CdkDrag,
	CdkDragDrop,
	CdkDragHandle,
	CdkDropList,
	moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
	FktAutocompleteComponent,
	FktButtonComponent,
	FktCheckboxComponent,
	FktInputComponent,
	FktTextareaComponent,
	SignalFormBuilder,
	SignalFormGroup,
	SignalValidators,
} from '@frakton-ng/core';
import { ProjectContextFieldPayload } from '@shared/models/payloads/project-context-field-payload';

@Component({
	selector: 'app-projects-context-fields-form',
	imports: [
		CdkDropList,
		CdkDrag,
		CdkDragHandle,
		FktAutocompleteComponent,
		FktTextareaComponent,
		FktInputComponent,
		FktButtonComponent,
		FktCheckboxComponent,
	],
	templateUrl: './projects-context-fields-form.component.html',
	styleUrl: './projects-context-fields-form.component.scss',
})
export class ProjectsContextFieldsFormComponent implements OnInit {
	confirm = output<ProjectContextFieldPayload>();
	contextField = input<ProjectContextField>();
	project = input.required<Project>();
	confirmButtonName = input.required<string>();
	title = input.required<string>();

	private fb = inject(SignalFormBuilder);

	protected form = this.fb.strictGroup<ProjectContextFieldPayload>({
		label: ['', SignalValidators.required()],
		description: ['', SignalValidators.required()],
		type: [null as any, SignalValidators.required()],
		required: [false, SignalValidators.required()],
		options: this.fb.array([
			this.fb.strictGroup<ProjectContextFieldPayload['options'][number]>({
				id: crypto.randomUUID(),
				label: ['', SignalValidators.required()],
			}),
		]),
	});

	protected typeOptions: AutocompleteOption[] = [
		{
			value: 'text',
			label: 'Texto',
		},
		{
			value: 'textarea',
			label: 'Texto longo',
		},
		{
			value: 'select',
			label: 'Lista de opções',
		},
		{
			value: 'checkbox',
			label: 'Caixa de seleção',
		},
		{
			value: 'image',
			label: 'Imagem',
		},
		{
			value: 'number',
			label: 'Número',
		},
	];

	protected search = signal('');

	protected selectedType = computed(() => this.form.value().type);

	// @MarkUsed()
	// validations = effect(() => {
	// 	const formValue = this.form.value();
	//
	// 	if (formValue.type === 'select') {
	// 		this.form.controls.options.controls().forEach(control => {
	// 			control.controls.label.addValidators(Validators.required);
	// 			control.controls.label.updateValueAndValidity();
	// 		});
	// 	} else {
	// 		this.form.controls.options.controls().forEach(control => {
	// 			control.controls.label.removeValidators(Validators.required);
	// 			control.controls.label.updateValueAndValidity();
	// 		});
	// 	}
	// });

	ngOnInit() {
		const contextField = this.contextField();

		if (contextField) {
			const optionsLength = contextField.options.length - 1;

			for (let i = 0; i < optionsLength; i++) {
				this.addField();
			}

			this.form.patchValue({
				...contextField,
				type: contextField.type.key,
			});
		}
	}

	drop(event: CdkDragDrop<any>) {
		const options = this.form.controls.options.value();

		moveItemInArray(options, event.previousIndex, event.currentIndex);

		this.form.controls.options.patchValue(options);
	}

	addField(controlReference?: SignalFormGroup<any>) {
		const group = this.fb.strictGroup<
			ProjectContextFieldPayload['options'][number]
		>({
			id: crypto.randomUUID(),
			label: ['', SignalValidators.required()],
		});

		const options = this.form.controls.options.controls();

		if (controlReference) {
			const index = options.indexOf(controlReference);
			this.form.controls.options.insert(index + 1, group);
		} else {
			this.form.controls.options.push(group);
		}
	}
	removeField(controlToRemove: SignalFormGroup<any>) {
		const options = this.form.controls.options.controls();

		const index = options.indexOf(controlToRemove);

		this.form.controls.options.removeAt(index);
	}

	protected submit() {
		this.confirm.emit(this.form.value());
	}
}
