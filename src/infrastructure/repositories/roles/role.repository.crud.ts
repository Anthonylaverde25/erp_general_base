import { injectable } from "inversify";
import { IRoleCrudRepository } from "@/domain/entities/roles/repositories/role.interface.crud";
import { RoleEntity } from "@/domain/entities/roles/Role";
import { RoleMapper } from "@/domain/entities/roles/Mappers/RoleMapper";
import axiosInstance from "@/lib/@axios";

@injectable()
export class RoleRepositoryCrud implements IRoleCrudRepository {
    async index(): Promise<RoleEntity[]> {
        const { data: { roles, meta, links } } = await axiosInstance.get('/roles');
        return RoleMapper.fromDetailDTOList(roles);
    }
}
