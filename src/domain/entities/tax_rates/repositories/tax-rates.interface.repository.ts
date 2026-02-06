import { TaxRateEntity, TaxRate } from "../TaxRateEntity";
import { CreateTaxRateDTO } from "../DTOs/CreateTaxRateDTO";

export interface ITaxRateRepository {
    index(): Promise<TaxRateEntity[]>;
    create(data: CreateTaxRateDTO): Promise<{ tax_rate: TaxRateEntity; message: string }>;
    update(id: TaxRate['id'], data: Partial<TaxRate>): Promise<{ tax_rate: TaxRateEntity; message: string }>;
    // delete(id: TaxRate['id']): Promise<void>; // Uncomment if needed
}
