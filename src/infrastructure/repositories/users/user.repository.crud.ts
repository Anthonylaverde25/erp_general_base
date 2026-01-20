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
      const { data: { user, message } } = await axiosInstance.post('/users', payload);
      console.log("usuario creado desde el repo", user);

      return {
        user: UserMapper.fromDetailDTO(user),
        message: message || 'Usuario creado correctamente'
      };
    } catch (error) {
      throw error;
    }
  }
}
