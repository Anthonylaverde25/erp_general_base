import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { IAddressRepository } from '@/domain/entities/addresses/repositories/address.interface.crud';

@injectable()
export class DeleteAddressUseCase implements IUseCase<number, void> {
    constructor(
        @inject(TYPES.IAddressRepository)
        private readonly repository: IAddressRepository
    ) { }

    async execute(id: number): Promise<void> {
        return await this.repository.delete(id);
    }
}
