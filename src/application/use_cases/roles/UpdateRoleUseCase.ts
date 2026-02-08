import { IUpdateRole } from '@/types/role.types';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { IRoleCrudRepository } from '@/domain/entities/roles/repositories/role.interface.crud';
import { RoleEntity } from '@/domain/entities/roles/Role';

@injectable()
export class UpdateRoleUseCase {
    constructor(@inject(TYPES.IRoleCrudRepository) private repository: IRoleCrudRepository) { }

    async execute(id: number, data: IUpdateRole): Promise<{ role: RoleEntity; message: string }> {
        const role = RoleEntity.update(id, data);
        return this.repository.update(id, role);
    }
}
