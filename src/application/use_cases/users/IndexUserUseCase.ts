import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { IUserCrudRepository } from '@/domain/entities/users/repositories/user.interface.crud';
import { UserEntity } from '@/domain/entities/users/User';
import { IUseCase } from '../IUseCase';

@injectable()
export class IndexUserUseCase implements IUseCase<void, UserEntity[]> {
	constructor(
		@inject(TYPES.IUserCrudRepository)
		private repository: IUserCrudRepository
	) {}

	async execute(): Promise<UserEntity[]> {
		return await this.repository.index();
	}
}
