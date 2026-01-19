import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
import { IUseCaseNoInput } from "../IUseCase";
import { User } from "@/domain/entities/users/User";
import type { IUserCrudRepository } from "@/domain/entities/users/repositories/user.interface.crud";



@injectable()
export class IndexUserUseCase implements IUseCaseNoInput<User[]> {
    constructor(
        @inject(TYPES.IUserCrudRepository)
        private readonly repository: IUserCrudRepository

    ) { }

    async execute(): Promise<User[]> {
        return await this.repository.index()
    }

}