import { ApplicationConfig } from '../../../models/application-config.js';
import { localJsonResource } from '../../local-json-resource.js';

const resource = localJsonResource<ApplicationConfig>('data/application-config.json');

const exists = () => resource.exists();

const get = async () => {

	const existsConfig = await exists();
	if (!existsConfig)
		return {
			languageFiles: []
		}

	return {...(await resource.get())};
};

const save = async (config: ApplicationConfig) => {
	await resource.save(config);
}

const update = async (fn: (config: ApplicationConfig) => ApplicationConfig) => {
	await save(fn(await get()));
}


export const applicationConfigService = {
	get,
	exists,
	save,
	update
}
