import { IUser } from './user.types';

export interface ILoginSuccessResponse {
	auth: {
		user: IUser;
		token: string;
	};
}

export interface ILoginErrorResponse {
	error: string;
}

export type LoginResponse = ILoginSuccessResponse | ILoginErrorResponse;
