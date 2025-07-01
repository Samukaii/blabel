import { ElectronFeatures } from '@shared/models/electron-features';
import { api } from '../../core/auth/api';
import { jwtToken } from '../../core/auth/jwt-token';
import { User } from '@shared/models/user';
import { currentUser } from '../../core/auth/current-user';

type AuthHandler = ElectronFeatures['auth'];

export const login: AuthHandler['login'] = async (payload) => {
  const {data} = await api().post<{ token: string; user: User }>('auth/login', payload);

  jwtToken.set(data.token);
  currentUser.set(data.user);

  return data.user;
}

export const isLoggedIn: AuthHandler['isLoggedIn'] = async () => {
  return !!jwtToken.get();
}

export const logout: AuthHandler['logout'] = async () => {
  jwtToken.clear();
  currentUser.clear();
}

export const register: AuthHandler['register'] = async (payload) => {
  const {data} = await api().post<{ token: string; user: User }>('auth/register', payload);

  jwtToken.set(data.token);
  currentUser.set(data.user);

  return data.user;
}

export const getCurrentUser: AuthHandler['currentUser'] = async () => {
  return currentUser.get();
}

export const authHandler: ElectronFeatures['auth'] = {
  login,
  isLoggedIn,
  logout,
  register,
  currentUser: getCurrentUser
}
