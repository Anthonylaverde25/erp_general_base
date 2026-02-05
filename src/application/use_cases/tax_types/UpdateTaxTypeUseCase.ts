import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { ITaxTypeRepository } from '@/domain/entities/tax_types/repositories/tax-types.interface.repository';
import { TaxTypeEntity, TaxType } from '@/domain/entities/tax_types/TaxTypeEntity';

@injectable()
export class UpdateTaxTypeUseCase {
    constructor(
        @inject(TYPES.ITaxTypeRepository)
        private taxTypeRepository: ITaxTypeRepository
    ) { }

    async execute(id: TaxType['id'], data: Partial<TaxTypeEntity>): Promise<{ tax_type: TaxTypeEntity; message: string }> {
        return await this.taxTypeRepository.update(id, data);
    }
}
