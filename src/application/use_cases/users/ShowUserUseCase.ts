import { IUser } from "@/types/user.types";
import { IUseCase } from "../IUseCase";
import { UserEntity } from "@/domain/entities/users/User";
import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
import type { IUserCrudRepository } from "@/domain/entities/users/repositories/user.interface.crud";


@injectable()
export class ShowUserUseCase implements IUseCase<IUser['id'], UserEntity> {

    constructor(
        @inject(TYPES.IUserCrudRepository)
        private readonly repository: IUserCrudRepository
    ) { }

    async execute(id: IUser['id']): Promise<UserEntity> {
        return await this.repository.show(id);
    }

}