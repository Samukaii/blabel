import { ElectronFeatures } from '@shared/models/electron-features';
import { Project } from '@shared/models/project';
import { api } from '../../core/api/api';
import { currentProject } from '../../core/current-project';
import { Injectable } from '../../di/di';
import { ProjectPayload } from '@shared/models/payloads/project-payload';
import { AllNullable } from '@shared/models/all-nullable';

type Interface = ElectronFeatures['projects'];

@Injectable({providedIn: "root"})
export class ProjectsHandler implements Interface {
	async getAll () {
		const {data} = await api().get<{ results: Project[] }>('projects');

		return data;
	}

	async getOne (id: string) {
		const {data} = await api().get<{ result: Project }>(`projects/${id}`);

		return data;
	}

	async select (id: string) {
		currentProject.set(id);
	}

	async isConfigured () {
		return !!currentProject.get()
	}
	async clearSelected () {
		currentProject.clear();
	}

	async create (payload: ProjectPayload) {
		const {data} = await api().post<{ result: Project }>(`projects`, payload);

		return data;
	}

	async updateOne (id: string, payload: Partial<AllNullable<ProjectPayload>>) {
		const {data} = await api().patch<{ result: Project }>(`projects/${id}`, payload);

		return data;
	}

	async remove (id: string) {
		const {data} = await api().delete<void>(`projects/${id}`);

		return data;
	}
}
