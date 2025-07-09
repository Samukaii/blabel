import { ElectronFeatures } from '@shared/models/electron-features';
import { ProjectLanguage } from '@shared/models/project-language';
import { ProjectLanguagePayload } from '@shared/models/payloads/project-language-payload';
import { AllNullable } from '@shared/models/all-nullable';
import { api } from '../../core/api/api';
import { Injectable } from 'backend/di/di';

type Interface = ElectronFeatures['projectLanguages'];

@Injectable({providedIn: 'root'})
export class ProjectsLanguagesHandler implements Interface {
	private baseUrl = (projectId: string) => `projects/${projectId}/languages`;

	async getAll(projectId: string) {
		const {data} = await api().get<{ results: ProjectLanguage[] }>(`${this.baseUrl(projectId)}`);

		return data;
	}

	async getOne(projectId: string, id: string) {
		const {data} = await api().get<{ result: ProjectLanguage }>(`${this.baseUrl(projectId)}/${id}`);

		return data;
	}

	async create(projectId: string, payload: ProjectLanguagePayload) {
		const {data} = await api().post<{ result: ProjectLanguage }>(`${this.baseUrl(projectId)}`, payload);

		return data;
	}

	async updateOne(projectId: string, id: string, payload: Partial<AllNullable<ProjectLanguagePayload>>) {
		const {data} = await api().patch<{ result: ProjectLanguage }>(`${this.baseUrl(projectId)}/${id}`, payload);

		return data;
	}

	async remove(projectId: string, id: string) {
		const {data} = await api().delete<void>(`${this.baseUrl(projectId)}/${id}`);

		return data;
	}
}
