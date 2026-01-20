import { UserMapper } from '@/domain/entities/users/Mappers/UserMapper';
import { IUserCrudRepository } from '@/domain/entities/users/repositories/user.interface.crud';
import { User } from '@/domain/entities/users/User';
import axiosInstance from '@/lib/@axios';
import { injectable } from 'inversify';

@injectable()
export class UserRepositoryCrud implements IUserCrudRepository {
  async index(): Promise<User[]> {
    const {
      data: { users }
    } = await axiosInstance.get(`/users`);
    return UserMapper.fromDetailDTOList(users);
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
}
