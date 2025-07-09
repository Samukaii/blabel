import axios, { AxiosInstance } from 'axios';
import * as process from 'node:process';
import { authRequestInterceptor } from '../../interceptors/auth-request.interceptor';

let client: AxiosInstance;
let temporaryCache = false;
const responseCache = new Map<string, any>();

export const api = () => {
	if (client) return client;

	client = axios.create({
		baseURL: process.env['API_URL'],
		timeout: 10000
	});

	client.interceptors.request.use((config) => {
		const cacheKey = config.url!;


		if (responseCache.has(cacheKey) && config.method==='get') {
			config.adapter = () => {
				return Promise.resolve({
					data: responseCache.get(cacheKey),
					status: 200,
					statusText: 'OK',
					headers: {},
					config,
				});
			};
		} else {
			delete config.adapter;
		}

		return config;
	});

	client.interceptors.response.use((response) => {
		if (temporaryCache && response.config.method==='get') {
			const cacheKey = response.config.url!;
			responseCache.set(cacheKey, response.data);
		}
		return response;
	});

	client.interceptors.request.use(authRequestInterceptor);

	return client;
}

export const enableAPICache = () => {
	temporaryCache = true;
}

export const disableAPICache = () => {
	temporaryCache = false;
	responseCache.clear();
}
