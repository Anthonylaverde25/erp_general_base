import { Container } from "inversify";
import { TYPES } from "../types";
import { ITaxTypeRepository } from "@/domain/entities/tax_types/repositories/tax-types.interface.repository";
import { TaxTypeRepositoryCrud } from "@/infrastructure/repositories/tax_types/TaxTypeRepositoryCrud";
import { IndexTaxTypesUseCase } from "@/application/use_cases/tax_types/IndexTaxTypesUseCase";
import { CreateTaxTypeUseCase } from "@/application/use_cases/tax_types/CreateTaxTypeUseCase";
import { UpdateTaxTypeUseCase } from "@/application/use_cases/tax_types/UpdateTaxTypeUseCase";

export function registerTaxTypesModule(container: Container) {
    // Repository
    container
        .bind<ITaxTypeRepository>(TYPES.ITaxTypeRepository)
        .to(TaxTypeRepositoryCrud);

    // Use Cases
    container
        .bind<IndexTaxTypesUseCase>(TYPES.IndexTaxTypesUseCase)
        .to(IndexTaxTypesUseCase);
    container
        .bind<CreateTaxTypeUseCase>(TYPES.CreateTaxTypeUseCase)
        .to(CreateTaxTypeUseCase);
    container
        .bind<UpdateTaxTypeUseCase>(TYPES.UpdateTaxTypeUseCase)
        .to(UpdateTaxTypeUseCase);
}
