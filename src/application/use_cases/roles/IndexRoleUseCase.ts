import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
import type { IRoleCrudRepository } from "@/domain/entities/roles/repositories/role.interface.crud";
import { RoleEntity } from "@/domain/entities/roles/Role";

@injectable()
export class IndexRoleUseCase {
    constructor(
        @inject(TYPES.IRoleCrudRepository) private repository: IRoleCrudRepository
    ) { }

    async execute(): Promise<RoleEntity[]> {
        return this.repository.index();
    }
}
