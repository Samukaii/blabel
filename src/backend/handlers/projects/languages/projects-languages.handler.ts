import { ElectronFeatures } from '@shared/models/electron-features';
import { api } from '../../../core/auth/api';
import { ProjectLanguage } from '@shared/models/project-language';

type ProjectsLanguagesHandler = ElectronFeatures['projects']['languages'];
const baseUrl = (projectId: string) => `projects/${projectId}/languages`;

const getAll: ProjectsLanguagesHandler['getAll'] = async (projectId) => {
  const {data} = await api().get<{ results: ProjectLanguage[] }>(`${baseUrl(projectId)}`);

  return data;
}

const getOne: ProjectsLanguagesHandler['getOne'] = async (projectId, id) => {
  const {data} = await api().get<{ result: ProjectLanguage }>(`${baseUrl(projectId)}/${id}`);

  return data;
}

const create: ProjectsLanguagesHandler['create'] = async (projectId, payload) => {
  const {data} = await api().post<{ result: ProjectLanguage }>(`${baseUrl(projectId)}`, payload);

  return data;
}

const updateOne: ProjectsLanguagesHandler['updateOne'] = async (projectId, id, payload) => {
	const {data} = await api().patch<{ result: ProjectLanguage }>(`${baseUrl(projectId)}/${id}`, payload);

	return data;
}

const remove: ProjectsLanguagesHandler['remove'] = async (projectId, id) => {
  const {data} = await api().delete<void>(`${baseUrl(projectId)}/${id}`);

  return data;
}

export const projectsLanguagesHandler: ProjectsLanguagesHandler = {
	getAll,
	getOne,
	updateOne,
	create,
	remove,
};
