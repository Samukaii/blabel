import { ElectronFeatures } from '@shared/models/electron-features';
import { Project } from '@shared/models/project';
import { api } from '../../core/auth/api';

type ProjectsHandler = ElectronFeatures['projects'];

const getAll: ProjectsHandler['getAll'] = async () => {
  const {data} = await api().get<{ results: Project[] }>('projects');

  return data;
}

const getOne: ProjectsHandler['getOne'] = async (id) => {
  const {data} = await api().get<{ result: Project }>(`projects/${id}`);

  return data;
}

const create: ProjectsHandler['create'] = async (payload) => {
  const {data} = await api().post<{ result: Project }>(`projects`, payload);

  return data;
}

const remove: ProjectsHandler['remove'] = async (id) => {
  const {data} = await api().delete<void>(`projects/${id}`);

  return data;
}

export const projectsHandler: ProjectsHandler = {
	getAll,
	getOne,
	create,
	remove,
};
