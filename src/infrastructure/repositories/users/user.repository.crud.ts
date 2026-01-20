import { UserMapper } from "@/domain/entities/users/Mappers/UserMapper";
import { IUserCrudRepository } from "@/domain/entities/users/repositories/user.interface.crud";
import { User } from "@/domain/entities/users/User";
import { CreateUserType } from "@/types/user.types";
import axiosInstance from "@/lib/@axios";
import { injectable } from "inversify";
import { toPlainObject } from "lodash";

@injectable()
export class UserRepositoryCrud implements IUserCrudRepository {
  async index(): Promise<User[]> {
    try {
      const {
        data: { users },
      } = await axiosInstance.get(`/users`);
      return UserMapper.fromDetailDTOList(users);
    } catch (error) {
      throw error;
    }
  }

  async create(data: User): Promise<{ user: User, message: string }> {
    try {
      const payload = data.toPlainObject();
      const response = await axiosInstance.post('/users', payload);
      // Backend might return wrapped data (Laravel Resource) or specific keys
      const userData = response.data.data || response.data.user || response.data;

      console.log("usuario creado desde el repo", response.data, userData);

      return {
        user: UserMapper.fromDetailDTO(userData),
        message: response.data.message || 'Usuario creado correctamente'
      };
    } catch (error) {
      throw error;
    }
  }
}
