import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/@axios';

interface PosLaunchResponse {
	data: {
		launch_token: string;
		expires_in: number;
	};
}

export const usePosLaunch = () => {
	return useMutation({
		mutationFn: async () => {
			const { data } = await axiosInstance.get<PosLaunchResponse>('pos/auth/launch-token');
			return data;
		},
	});
};
