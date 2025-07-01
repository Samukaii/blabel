import axios, { AxiosInstance } from 'axios';
import * as process from 'node:process';
import { authRequestInterceptor } from '../../interceptors/auth-request.interceptor';

let client: AxiosInstance;

export const api = () => {
  if (client) return client;

  client = axios.create({
    baseURL: process.env['API_URL'],
    timeout: 10000
  });

  client.interceptors.request.use(authRequestInterceptor);

  return client;
}
