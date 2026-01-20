import { RoleEntity } from "../Role";

export interface IRoleCrudRepository {
    index(): Promise<RoleEntity[]>;
}
