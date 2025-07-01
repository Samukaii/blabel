import { InternalAxiosRequestConfig } from 'axios';
import { jwtToken } from '../core/auth/jwt-token';

export const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  if (jwtToken.get()) {
    config.headers.Authorization = `Bearer ${jwtToken.get()}`;
  }
  return config;
}
