import { UserTypes } from './user.types';

export interface LoginSuccesResponse {
	auth: {
		user: UserTypes;
		token: string;
	};
}

export interface LoginErrorResponse {
	error: string;
}

export type LoginResponse = LoginSuccesResponse | LoginErrorResponse;
