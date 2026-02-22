import { ICreateUser } from '@/types/user.types';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '../IUseCase';
import type { IUserCrudRepository } from '@/domain/entities/users/repositories/user.interface.crud';
import { UserEntity } from '@/domain/entities/users/User';

@injectable()
export class CreateUserUseCase implements IUseCase<ICreateUser, { user: UserEntity; message: string }> {
	constructor(@inject(TYPES.IUserCrudRepository) private repository: IUserCrudRepository) {}

	async execute(data: ICreateUser): Promise<{ user: UserEntity; message: string }> {
		const user = UserEntity.create(data);
		return this.repository.create(user);
	}
}
