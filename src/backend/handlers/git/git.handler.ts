import { ElectronFeatures } from '@shared/models/electron-features';
import { api } from '../../core/auth/api';
import { ListResponse } from '@shared/models/list-response';
import { GitConnectionResponse } from '@shared/models/responses/git-connection-response';

type GitHandler = ElectronFeatures['git'];

const connect: GitHandler['connect'] = async (payload) => {
	const {data} = await api().post<GitConnectionResponse>(`git_integration/${payload.projectId}/connect`, {
		accessToken: payload.token,
		provider: payload.provider
	});

	return data;
}

const getBranches: GitHandler['getBranches'] = async (projectId, repository) => {
	const {data} = await api().get<ListResponse<string>>(`git_integration/${projectId}/branches`, {
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
	const {data} = await api().get<ListResponse<string>>(`git_integration/${projectId}/repositories`);

	return {
		results: data.results.map(value => ({
			value: value,
			label: value
		}))
	};
}

const getConnection: GitHandler['getConnection'] = async (projectId) => {
	const {data} = await api().get<GitConnectionResponse>(`git_integration/${projectId}`);

	return data;
}


export const gitHandler: GitHandler = {
	connect,
	getBranches,
	getRepositories,
	getConnection,
};
