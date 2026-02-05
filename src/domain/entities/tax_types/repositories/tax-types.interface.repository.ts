import { TaxTypeEntity, TaxType } from "../TaxTypeEntity";
import { CreateTaxTypeDTO } from "../DTOs/CreateTaxTypeDTO";

export interface ITaxTypeRepository {
    index(): Promise<TaxTypeEntity[]>;
    create(data: CreateTaxTypeDTO): Promise<{ tax_type: TaxTypeEntity; message: string }>;
    update(id: TaxType['id'], data: Partial<TaxTypeEntity>): Promise<{ tax_type: TaxTypeEntity; message: string }>;
}
