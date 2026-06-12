import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { IUserCrudRepository } from '@/domain/entities/users/repositories/user.interface.crud';
import { UserEntity } from '@/domain/entities/users/User';

@injectable()
export class AssociateEmployeesUseCase {
	constructor(@inject(TYPES.IUserCrudRepository) private repository: IUserCrudRepository) {}

	async execute(id: number, employeeIds: number[]): Promise<{ user: UserEntity; message: string }> {
		return this.repository.associateEmployees(id, employeeIds);
	}
}
