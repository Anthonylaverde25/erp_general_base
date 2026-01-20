import { UserMapper } from '@/domain/entities/users/Mappers/UserMapper';
import { IUserCrudRepository } from '@/domain/entities/users/repositories/user.interface.crud';
import { User } from '@/domain/entities/users/User';
import axiosInstance from '@/lib/@axios';
import { UserType } from '@/types/user.types';
import { injectable } from 'inversify';

@injectable()
export class UserRepositoryCrud implements IUserCrudRepository {
  async index(): Promise<User[]> {
    const {
      data: { users }
    } = await axiosInstance.get(`/users`);
    return UserMapper.fromDetailDTOList(users);
  }


  async show(id: UserType['id']): Promise<User> {
    const {
      data: { user }
    } = await axiosInstance.get(`/users/${id}`);
    return UserMapper.fromDetailDTO(user);
  }

  async create(data: User): Promise<{ user: User; message: string }> {
    const payload = data.toPlainObject();
    const {
      data: { user, message }
    } = await axiosInstance.post('/users', payload);

    return {
      user: UserMapper.fromDetailDTO(user),
      message: message || 'Usuario creado correctamente'
    };
  }

  async update(id: number, data: User): Promise<{ user: User; message: string }> {
    const payload = data.toPlainObject();
    const {
      data: { user, message }
    } = await axiosInstance.put(`/users/${id}`, payload);

    return {
      user: UserMapper.fromDetailDTO(user),
      message: message || 'Usuario actualizado correctamente'
    };
  }
}
