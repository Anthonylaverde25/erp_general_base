import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { ITaxTypeRepository } from '@/domain/entities/tax_types/repositories/tax-types.interface.repository';
import { TaxTypeEntity } from '@/domain/entities/tax_types/TaxTypeEntity';
import { CreateTaxTypeDTO } from '@/domain/entities/tax_types/DTOs/CreateTaxTypeDTO';

@injectable()
export class CreateTaxTypeUseCase implements IUseCase<CreateTaxTypeDTO, { tax_type: TaxTypeEntity; message: string }> {
    constructor(
        @inject(TYPES.ITaxTypeRepository)
        private readonly repository: ITaxTypeRepository
    ) { }

    async execute(data: CreateTaxTypeDTO): Promise<{ tax_type: TaxTypeEntity; message: string }> {
        return await this.repository.create(data);
    }
}
