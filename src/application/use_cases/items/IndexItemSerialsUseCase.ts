import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { IItemActionRepository } from '@/domain/entities/items/repositories/item.action.repository';
import type { PaginatedItemSerials } from '@/types/item-serials.types';

@injectable()
export class IndexItemSerialsUseCase {
	constructor(
		@inject(TYPES.IItemActionRepository)
		private repository: IItemActionRepository
	) {}

	async execute(
		page?: number,
		perPage?: number,
		filters?: {
			search?: string;
			status?: string;
			start_date?: string;
			end_date?: string;
			document_type?: string;
		}
	): Promise<PaginatedItemSerials> {
		return await this.repository.indexItemSerials(page, perPage, filters);
	}
}
