import { TYPES } from "@/di/types";
import type { IRoleCrudRepository } from "@/domain/entities/roles/repositories/role.interface.crud";
import { RoleEntity } from "@/domain/entities/roles/Role";
import { RoleType } from "@/types/role.types";
import { inject, injectable } from "inversify";

@injectable()
export class ShowRoleUseCase {
  constructor(
    @inject(TYPES.IRoleCrudRepository) private repository: IRoleCrudRepository,
  ) {}

  async execute(id: RoleType["id"]): Promise<RoleEntity> {
    const u = await this.repository.show(id);
    console.log("role desde el usecase", u);
    return u;
  }
}
