import { ElectronFeatures } from '@shared/models/electron-features';
import { api } from '../../core/api/api';
import { ListResponse } from '@shared/models/list-response';
import { GitConnectionResponse } from '@shared/models/responses/git-connection-response';
import { GitIntegrationFile } from '@shared/models/git-integration-file';
import { Injectable } from 'backend/di/di';
import { GitConnectPayload } from '@shared/models/payloads/git-connect-payload';

type Interface = ElectronFeatures['git'];

@Injectable({providedIn: 'root'})
export class GitHandler implements Interface {
	async connect(payload: GitConnectPayload) {
		const {token, provider, projectId} = payload

		const {data} = await api().post<GitConnectionResponse>(`projects/${projectId}/git/connect`, {
			accessToken: token,
			provider
		});

		return data;
	}

	async getBranches(projectId: string, repository: string) {
		const {data} = await api().get<ListResponse<string>>(`projects/${projectId}/git/branches`, {
			data: {repository}
		});

		return {
			results: data.results.map(value => ({
				value: value,
				label: value
			}))
		};
	}

	async getRepositories(projectId: string) {
		const {data} = await api().get<ListResponse<string>>(`projects/${projectId}/git/repositories`);

		return {
			results: data.results.map(value => ({
				value: value,
				label: value
			}))
		};
	}

	async getConnection(projectId: string) {
		const {data} = await api().get<GitConnectionResponse>(`projects/${projectId}/git/connection`);

		return data;
	}

	async disconnect(projectId: string) {
		await api().delete(`projects/${projectId}/git`);
	}

	async findFile(projectId: string, file: string) {
		const {data} = await api().get<GitIntegrationFile>(`projects/${projectId}/git/file`, {
			data: {file}
		});

		return data;
	}
}

