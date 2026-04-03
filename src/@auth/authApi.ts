import { User } from '@auth/user';
import UserModel from '@auth/user/models/UserModel';
import { PartialDeep } from 'type-fest';
import api from '@/utils/api';
import axiosInstance from '@/lib/@axios';
import { ILoginSuccessResponse } from '@/types/auth.types';
import { IUser } from '@/types/user.types';

type AuthResponse = {
	user: IUser;
	access_token: string;
};

/**
 * Refreshes the access token
 */
export async function authRefreshToken(): Promise<Response> {
	return api.post('mock/auth/refresh', {
		retry: 0 // Don't retry refresh token requests
	});
}

/**
 * Sign in with token
 */
export async function authSignInWithToken(accessToken: string): Promise<Response> {
	return api.get('mock/auth/sign-in-with-token', {
		headers: { Authorization: `Bearer ${accessToken}` }
	});
}

/**`
 * Sign in
 */
export async function authSignIn(credentials: { email: string; password: string }): Promise<AuthResponse> {
	const {
		data: {
			auth: { user, token }
		}
	} = await axiosInstance.post<ILoginSuccessResponse>(`auth/login`, credentials);

	return {
		user,
		access_token: token
	};
}

/**
 * Sign up
 */
export async function authSignUp(data: {
	displayName: string;
	email: string;
	password: string;
}): Promise<AuthResponse> {
	return api
		.post('mock/auth/sign-up', {
			json: data
		})
		.json();
}

/**
 * Get user by id
 */
export async function authGetDbUser(userId: string): Promise<User> {
	return api.get(`mock/auth/user/${userId}`).json();
}

/**
 * Get user by email
 */
export async function authGetDbUserByEmail(email: string): Promise<User> {
	return api.get(`mock/auth/user-by-email/${email}`).json();
}

/**
 * Update user
 */
export async function authUpdateDbUser(user: PartialDeep<User>): Promise<Response> {
	return axiosInstance.put(`users/${user.id}`, user);
}

/**
 * Sign out
 */
export async function authLogout(): Promise<void> {
	await axiosInstance.post('auth/logout');
}

/**
 * Create user
 */
export async function authCreateDbUser(user: PartialDeep<User>): Promise<User> {
	return api
		.post('mock/users', {
			json: UserModel(user)
		})
		.json();
}
