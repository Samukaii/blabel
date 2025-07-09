import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { projectsContextFieldsForm } from './projects-context-fields-form';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AutocompleteComponent } from '../../../../shared/components/autocomplete/autocomplete.component';
import { InferFormValueFn } from '../../../../shared/models/infer-form-value-fn';
import { getElectron } from '../../../../shared/di/functions/get-electron';
import { formIsValid } from 'web/app/shared/utils/form-is-valid';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { Project } from "@shared/models/project";
import { formValueToSignal } from '../../../../shared/utils/control-value-to-signal';
import { ProjectContextField } from '@shared/models/project-context-field';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea.component';
import { AutocompleteOption } from '@shared/models/autocomplete-option';
import { CheckboxComponent } from '../../../../shared/components/checkbox/checkbox.component';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, Validators } from '@angular/forms';
import { MarkUsed } from '../../../../shared/utils/mark-used';


@Component({
	selector: 'app-projects-context-fields-form',
	imports: [
		ButtonComponent,
		AutocompleteComponent,
		InputComponent,
		TextareaComponent,
		CheckboxComponent,
		CdkDropList,
		CdkDrag,
		CdkDragHandle,

	],
	templateUrl: './projects-context-fields-form.component.html',
	styleUrl: './projects-context-fields-form.component.scss'
})
export class ProjectsContextFieldsFormComponent implements OnInit {
	confirm = output<InferFormValueFn<typeof projectsContextFieldsForm>>();
	contextField = input<ProjectContextField>();
	project = input.required<Project>();
	confirmButtonName = input.required<string>()
	title = input.required<string>();

	protected form = projectsContextFieldsForm();
	protected fb = inject(FormBuilder);
	private api = getElectron();

	protected typeOptions: AutocompleteOption[] = [
		{
			value: "text",
			label: "Texto"
		},
		{
			value: "textarea",
			label: "Texto longo"
		},
		{
			value: "select",
			label: "Lista de opções"
		},
		{
			value: "checkbox",
			label: "Caixa de seleção"
		},
		{
			value: "image",
			label: "Imagem"
		},
		{
			value: "number",
			label: "Número"
		}
	];

	protected options = signal<(typeof this.form)['controls']['options']['controls']>([]);

	protected formIsValid = formIsValid(this.form);
	protected search = signal('');

	protected formValue = formValueToSignal(this.form, {checkEquality: true});
	protected selectedType = computed(() => this.formValue().type)

	@MarkUsed()
	validations = effect(() => {
		const formValue = this.formValue();

		if(formValue.type === "select") {
			this.form.controls.options.controls.forEach(control => {
				control.controls.label.addValidators(Validators.required);
				control.controls.label.updateValueAndValidity();
			});
		}
		else {
			this.form.controls.options.controls.forEach(control => {
				control.controls.label.removeValidators(Validators.required);
				control.controls.label.updateValueAndValidity();
			});
		}
	})

	ngOnInit() {
		const contextField = this.contextField();

		this.options.set(this.form.controls.options.controls);

		if (contextField) {
			const optionsLength = contextField.options.length - 1;

			for (let i = 0; i < optionsLength; i++) {
				this.addField();
			}

			this.form.patchValue({
				...contextField,
				type: contextField.type.key
			});
		}

	}

	drop(event: CdkDragDrop<typeof this.form['controls']['options']['controls']>) {
		moveItemInArray(this.form.controls.options.controls, event.previousIndex, event.currentIndex);
		this.updateFields();
	}

	addField(controlReference?: typeof this.form['controls']['options']['controls'][number]) {

		const group = this.fb.nonNullable.group({
			id: [crypto.randomUUID()],
			label: ["", Validators.required]
		});

		if(controlReference) {
			const index = this.options().findIndex(control => control.value.id === controlReference.value.id);
			this.form.controls.options.insert(index + 1, group);
		}
		else {
			this.form.controls.options.push(group);
		}

		this.updateFields();
	}
	removeField(controlToRemove: typeof this.form['controls']['options']['controls'][number]) {
		const index = this.options().findIndex(control => control.value.id === controlToRemove.value.id);
		this.form.controls.options.removeAt(index);
		this.options.set(this.form.controls.options.controls);
	}

	updateFields() {
		this.options.set(this.form.controls.options.controls);
	}


	protected submit() {
		this.confirm.emit(this.form.getRawValue());
	}
}
