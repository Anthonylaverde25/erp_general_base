import { UserMapper } from '@/domain/entities/users/Mappers/UserMapper';
import { IUserCrudRepository } from '@/domain/entities/users/repositories/user.interface.crud';
import { User } from '@/domain/entities/users/User';
import axiosInstance from '@/lib/@axios';
import { injectable } from 'inversify';


@injectable()
export class UserRepositoryCrud implements IUserCrudRepository {


  async index(): Promise<User[]> {
    try {
      const { data } = await axiosInstance.get(`/users`)
      console.log('data desde el repo', data.users)
      return UserMapper.fromDetailDTOList(data.users)
    } catch (error) {
      throw error
    }
  }

}
