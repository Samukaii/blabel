import { ElectronFeatures } from '@shared/models/electron-features';
import { api } from '../../core/api/api';
import { ProjectContextField } from '@shared/models/project-context-field';
import { Injectable } from 'backend/di/di';
import { ProjectContextFieldPayload } from '@shared/models/payloads/project-context-field-payload';
import { AllNullable } from '@shared/models/all-nullable';

type Interface = ElectronFeatures['contextFields'];
const baseUrl = (projectId: string) => `projects/${projectId}/context_fields`;

@Injectable({providedIn: 'root'})
export class ContextFieldsHandler implements Interface {
	async getAll (projectId: string) {
		const {data} = await api().get<{ results: ProjectContextField[] }>(`${baseUrl(projectId)}`);

		return data;
	}

	async getOne (projectId: string, id: string) {
		const {data} = await api().get<{ result: ProjectContextField }>(`${baseUrl(projectId)}/${id}`);

		return data;
	}

	async create (projectId: string, payload: ProjectContextFieldPayload) {
		const {data} = await api().post<{ result: ProjectContextField }>(`${baseUrl(projectId)}`, payload);

		return data;
	}

	async updateOne (projectId: string, id: string, payload: Partial<AllNullable<ProjectContextFieldPayload>>) {
		const {data} = await api().patch<{ result: ProjectContextField }>(`${baseUrl(projectId)}/${id}`, payload);

		return data;
	}

	async remove (projectId: string, id: string) {
		const {data} = await api().delete<void>(`${baseUrl(projectId)}/${id}`);

		return data;
	}
}

