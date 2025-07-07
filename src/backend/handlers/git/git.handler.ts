import { ElectronFeatures } from '@shared/models/electron-features';
import { api } from '../../core/auth/api';
import { ListResponse } from '@shared/models/list-response';
import { GitConnectionResponse } from '@shared/models/responses/git-connection-response';
import { GitIntegrationFile } from '@shared/models/git-integration-file';

type GitHandler = ElectronFeatures['git'];

const connect: GitHandler['connect'] = async (payload) => {
	const {token, provider, projectId} = payload

	const {data} = await api().post<GitConnectionResponse>(`projects/${projectId}/git/connect`, {
		accessToken: token,
		provider
	});

	return data;
}

const getBranches: GitHandler['getBranches'] = async (projectId, repository) => {
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

const getRepositories: GitHandler['getRepositories'] = async (projectId) => {
	const {data} = await api().get<ListResponse<string>>(`projects/${projectId}/git/repositories`);

	return {
		results: data.results.map(value => ({
			value: value,
			label: value
		}))
	};
}

const getConnection: GitHandler['getConnection'] = async (projectId) => {
	const {data} = await api().get<GitConnectionResponse>(`projects/${projectId}/git/connection`);

	return data;
}

const disconnect: GitHandler['disconnect'] = async (projectId) => {
	await api().delete(`projects/${projectId}/git`);
}

const findFile: GitHandler['findFile'] = async (projectId, file) => {
	const {data} = await api().get<GitIntegrationFile>(`projects/${projectId}/git/file`, {
		data: {file}
	});

	return data;
}

export const gitHandler: GitHandler = {
	connect,
	getBranches,
	getRepositories,
	getConnection,
	disconnect,
	findFile
};
