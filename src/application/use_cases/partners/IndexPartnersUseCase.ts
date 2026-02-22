import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { IPartnerRepository } from '@/domain/entities/partners/repositories/partner.repository';
import { PartnerEntity } from '@/domain/entities/partners/PartnerEntity';

@injectable()
export class IndexPartnersUseCase {
	constructor(
		@inject(TYPES.PartnerRepository)
		private repository: IPartnerRepository
	) {}

	async execute(): Promise<PartnerEntity[]> {
		return await this.repository.index();
	}
}
