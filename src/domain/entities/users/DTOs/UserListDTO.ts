import { IRole } from '@/types/role.types';

export interface UserListDTO {
	id: number;
	name: string;
	email: string;
	phone?: string;
	role: IRole | null;
	role_ids?: number[];
	status: string;
}
