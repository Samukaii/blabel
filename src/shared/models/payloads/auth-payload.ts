export interface LoginPayload {
	email: string;
	password: string;
}

export interface RegisterPayload extends LoginPayload {
	name: string;
	password: string;
	passwordConfirmation: string;
}
