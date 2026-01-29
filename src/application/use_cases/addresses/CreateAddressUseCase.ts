import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { IAddressRepository } from '@/domain/entities/addresses/repositories/address.interface.crud';
import { CreateAddressDTO } from '@/domain/entities/addresses/DTOs/CreateAddressDTO';
import { AddressEntity } from '@/domain/entities/addresses/Address';

@injectable()
export class CreateAddressUseCase implements IUseCase<{ companyId: number, data: CreateAddressDTO }, { address: AddressEntity, message: string }> {
    constructor(
        @inject(TYPES.IAddressRepository)
        private readonly repository: IAddressRepository
    ) { }

    async execute({ companyId, data }: { companyId: number, data: CreateAddressDTO }): Promise<{ address: AddressEntity, message: string }> {
        return await this.repository.create(companyId, data);
    }
}
