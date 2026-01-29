import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { IAddressRepository } from '@/domain/entities/addresses/repositories/address.interface.crud';
import { CreateAddressDTO } from '@/domain/entities/addresses/DTOs/CreateAddressDTO';
import { AddressEntity } from '@/domain/entities/addresses/Address';

@injectable()
export class UpdateAddressUseCase implements IUseCase<{ id: number, data: Partial<AddressEntity> }, { address: AddressEntity, message: string }> {
    constructor(
        @inject(TYPES.IAddressRepository)
        private readonly repository: IAddressRepository
    ) { }

    async execute({ id, data }: { id: number, data: Partial<AddressEntity> }): Promise<{ address: AddressEntity, message: string }> {
        const address = AddressEntity.update(id, data);
        return await this.repository.update(id, address);
    }
}
