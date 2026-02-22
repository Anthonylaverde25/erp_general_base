import { UserMapper } from '@/domain/entities/users/Mappers/UserMapper';
import { IUserCrudRepository } from '@/domain/entities/users/repositories/user.interface.crud';
import { UserEntity } from '@/domain/entities/users/User';
import axiosInstance from '@/lib/@axios';
import { IUser } from '@/types/user.types';
import { injectable } from 'inversify';

@injectable()
export class UserRepositoryCrud implements IUserCrudRepository {
	async index(): Promise<UserEntity[]> {
		const {
			data: { users }
		} = await axiosInstance.get('users');
		return UserMapper.fromDetailDTOList(users);
	}

	async show(id: IUser['id']): Promise<UserEntity> {
		const {
			data: { user }
		} = await axiosInstance.get(`users/${id}`);
		return UserMapper.fromDetailDTO(user);
	}

	async create(data: UserEntity): Promise<{ user: UserEntity; message: string }> {
		const {
			data: { user, message }
		} = await axiosInstance.post('users', data);

		return {
			user: UserMapper.fromDetailDTO(user),
			message: message
		};
	}

	async update(id: number, data: UserEntity): Promise<{ user: UserEntity; message: string }> {
		const payload = data.toPlainObject();
		const {
			data: { user, message }
		} = await axiosInstance.put(`/users/${id}`, payload);

		return {
			user: UserMapper.fromDetailDTO(user),
			message: message || 'Usuario actualizado correctamente'
		};
	}

	async remove(id: number): Promise<{ message: string }> {
		const { data } = await axiosInstance.delete(`users/${id}`);
		return data;
	}
}
