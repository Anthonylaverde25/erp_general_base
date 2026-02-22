import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { IStoreRepository } from '@/domain/entities/stores/repositories/store.interface.repository';
import { StoreEntity } from '@/domain/entities/stores/StoreEntity';

@injectable()
export class IndexStoresUseCase implements IUseCase<void, StoreEntity[]> {
	constructor(
		@inject(TYPES.IStoreRepository)
		private readonly repository: IStoreRepository
	) {}

	async execute(): Promise<StoreEntity[]> {
		return await this.repository.index();
	}
}
