import { UserType } from "@/types/user.types";
import { IUseCase } from "../IUseCase";
import { User } from "@/domain/entities/users/User";
import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
import type { IUserCrudRepository } from "@/domain/entities/users/repositories/user.interface.crud";


@injectable()
export class ShowUserUseCase implements IUseCase<UserType['id'], User> {

    constructor(
        @inject(TYPES.IUserCrudRepository)
        private readonly repository: IUserCrudRepository
    ) { }

    async execute(id: UserType['id']): Promise<User> {
        return await this.repository.show(id);
    }

}