import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { IAddressRepository } from '@/domain/entities/addresses/repositories/address.interface.crud';
import { AddressEntity } from '@/domain/entities/addresses/Address';

@injectable()
export class ShowAddressUseCase implements IUseCase<number, AddressEntity> {
    constructor(
        @inject(TYPES.IAddressRepository)
        private readonly repository: IAddressRepository
    ) { }

    async execute(id: number): Promise<AddressEntity> {
        return await this.repository.show(id);
    }
}
