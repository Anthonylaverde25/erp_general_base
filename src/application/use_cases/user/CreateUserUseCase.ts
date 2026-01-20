import { CreateUserType } from "@/types/user.types";
import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
import type { IUserCrudRepository } from "@/domain/entities/users/repositories/user.interface.crud";
import { User } from "@/domain/entities/users/User";

@injectable()
export class CreateUserUseCase {
    constructor(
        @inject(TYPES.IUserCrudRepository) private repository: IUserCrudRepository
    ) { }

    async execute(data: CreateUserType): Promise<{ user: User, message: string }> {
        const user = User.create(data);
        return this.repository.create(user);
    }
}
