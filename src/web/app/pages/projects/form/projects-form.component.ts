import {
	Component,
	inject,
	input,
	OnInit,
	output,
	signal,
} from '@angular/core';
import { ProjectPayload } from './project-payload';
import { Project } from '@shared/models/project';
import {
	FktButtonComponent,
	FktInputComponent,
	FktTextareaComponent,
	SignalFormBuilder,
	SignalValidators,
} from '@frakton-ng/core';

@Component({
	selector: 'app-projects-form',
	imports: [FktButtonComponent, FktTextareaComponent, FktInputComponent],
	templateUrl: './projects-form.component.html',
	styleUrl: './projects-form.component.scss',
})
export class ProjectsFormComponent implements OnInit {
	confirm = output<ProjectPayload>();
	title = input.required<string>();
	project = input<Project>();
	confirmButtonName = input.required<string>();

	private fb = inject(SignalFormBuilder);

	protected form = this.fb.strictGroup<ProjectPayload>({
		name: ['', SignalValidators.required()],
		description: '',
	});

	search = signal('');

	ngOnInit() {
		const project = this.project();

		if (project)
			this.form.patchValue({
				name: project.name,
				description: project.description as string,
			});
	}

	protected submit() {
		this.confirm.emit(this.form.value());
	}
}
