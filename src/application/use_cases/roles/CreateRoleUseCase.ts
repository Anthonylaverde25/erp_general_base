import { ICreateRole } from '@/types/role.types';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { IRoleCrudRepository } from '@/domain/entities/roles/repositories/role.interface.crud';
import { RoleEntity } from '@/domain/entities/roles/Role';

@injectable()
export class CreateRoleUseCase {
	constructor(@inject(TYPES.IRoleCrudRepository) private repository: IRoleCrudRepository) {}

	async execute(data: ICreateRole): Promise<{ role: RoleEntity; message: string }> {
		const role = RoleEntity.create(data);
		return this.repository.create(role);
	}
}
