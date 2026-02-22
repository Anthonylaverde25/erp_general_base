import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '../IUseCase';
import type { ICompanyActionRepository } from '@/domain/entities/companies/repositories/company.interface.action';
import { CreateAddressDTO } from '@/domain/entities/addresses/DTOs/CreateAddressDTO';
import { AddressEntity } from '@/domain/entities/addresses/Address';

@injectable()
export class CreateAddressUseCase
	implements IUseCase<{ companyId: number; data: CreateAddressDTO }, { address: AddressEntity; message: string }>
{
	constructor(
		@inject(TYPES.ICompanyActionRepository)
		private readonly repository: ICompanyActionRepository
	) {}

	async execute({
		companyId,
		data
	}: {
		companyId: number;
		data: CreateAddressDTO;
	}): Promise<{ address: AddressEntity; message: string }> {
		const address = AddressEntity.create(data);
		return await this.repository.createAddress(companyId, address);
	}
}
