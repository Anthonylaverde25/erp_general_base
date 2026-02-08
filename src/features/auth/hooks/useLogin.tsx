import axiosInstance from '@/lib/@axios';
import { ILoginSuccessResponse } from '@/types/auth.types';
import { useMutation } from '@tanstack/react-query';

interface Credentials {
	email: string;
	password: string;
}

export default function useLogin() {
	const mutate = useMutation({
		mutationFn: async (credentials: Credentials) => {
			const { data } = await axiosInstance.post<ILoginSuccessResponse>(`auth/login`, credentials);
			return data;
		},

		onSuccess: (data) => {
			const {
				auth: { user, token }
			} = data;

			// TODO: Handle successful login (store token, update auth state, etc.)
			console.log('Login successful:', user, token);
		},

		onError: (error) => {
			// React Query automatically catches HTTP errors here
			console.error('Login failed:', error);
		}
	});

	const handleLogin = (credentials: Credentials) => {
		mutate.mutateAsync(credentials);
	};

	return {
		handleLogin,
		isLoading: mutate.isPending,
		isError: mutate.isError,
		error: mutate.error
	};
}
