import { ElectronFeatures } from '@shared/models/electron-features';
import { api } from '../../core/api/api';
import { jwtToken } from '../../core/auth/jwt-token';
import { User } from '@shared/models/user';
import { LoginPayload, RegisterPayload } from '@shared/models/payloads/auth-payload';
import { Injectable } from 'backend/di/di';

type Interface = ElectronFeatures['auth'];

@Injectable({providedIn: 'root'})
export class AuthHandler implements Interface {
	private currentUser: User | null = null;

	async login(payload: LoginPayload) {
		const {data} = await api().post<{ token: string; user: User }>('auth/login', payload);

		jwtToken.set(data.token);
		this.currentUser = data.user;

		return data.user;
	}

	async isLoggedIn() {
		return !!jwtToken.get();
	}

	async logout() {
		jwtToken.clear();
		this.currentUser = null;
	}

	async register(payload: RegisterPayload) {
		const {data} = await api().post<{ token: string; user: User }>('auth/register', payload);

		jwtToken.set(data.token);
		this.currentUser = data.user;

		return data.user;
	}

	async getCurrentUser() {
		if (this.currentUser) return this.currentUser;

		const {data} = await api().get<{ token: string; user: User }>('auth/current_user');

		this.currentUser = data.user;

		return data.user;
	}

	async refreshUser() {
		this.currentUser = null;

		return await this.getCurrentUser();
	}
}
