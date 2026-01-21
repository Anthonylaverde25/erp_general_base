import { RoleType } from "@/types/role.types";
import { RoleEntity } from "../Role";

export interface IRoleCrudRepository {
  index(): Promise<RoleEntity[]>;
  create(data: RoleEntity): Promise<{ role: RoleEntity; message: string }>;
  show(id: RoleType["id"]): Promise<RoleEntity>;
  update(
    id: number,
    data: RoleEntity,
  ): Promise<{ role: RoleEntity; message: string }>;
}
