import { IUpdateUser } from '@/types/user.types';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { IUserCrudRepository } from '@/domain/entities/users/repositories/user.interface.crud';
import { UserEntity } from '@/domain/entities/users/User';

@injectable()
export class UpdateUserUseCase {
	constructor(@inject(TYPES.IUserCrudRepository) private repository: IUserCrudRepository) {}

	async execute(id: number, data: IUpdateUser): Promise<{ user: UserEntity; message: string }> {
		const user = UserEntity.update(id, data);
		return this.repository.update(id, user);
	}
}
