import { Route } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectsUpdateComponent } from './update/projects-update.component';

export default [
	{
		path: '',
		component: ProjectsComponent
	},
	{
		path: ':id',
		component: ProjectsUpdateComponent
	}
] satisfies Route[];
