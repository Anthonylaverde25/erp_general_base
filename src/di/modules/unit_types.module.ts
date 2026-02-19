import { Container } from "inversify";
import { TYPES } from "../types";
import { IUnitTypeRepository } from "@/domain/entities/unit_types/repositories/unit_type.interface.repository";
import { UnitTypeRepositoryCrud } from "@/infrastructure/repositories/unit_types/UnitTypeRepositoryCrud";

import { CreateUnitTypeUseCase } from "@/application/useCases/unit_types/CreateUnitTypeUseCase";
import { UpdateUnitTypeUseCase } from "@/application/useCases/unit_types/UpdateUnitTypeUseCase";
import { IndexUnitTypesUseCase } from "@/application/useCases/unit_types/IndexUnitTypesUseCase";
import { DeleteUnitTypeUseCase } from "@/application/useCases/unit_types/DeleteUnitTypeUseCase";

export const UnitTypeModule = (container: Container) => {
    container
        .bind<IUnitTypeRepository>(TYPES.UnitTypeRepository)
        .to(UnitTypeRepositoryCrud);

    container.bind<CreateUnitTypeUseCase>(TYPES.CreateUnitTypeUseCase).to(CreateUnitTypeUseCase);
    container.bind<UpdateUnitTypeUseCase>(TYPES.UpdateUnitTypeUseCase).to(UpdateUnitTypeUseCase);
    container.bind<IndexUnitTypesUseCase>(TYPES.IndexUnitTypesUseCase).to(IndexUnitTypesUseCase);
    container.bind<DeleteUnitTypeUseCase>(TYPES.DeleteUnitTypeUseCase).to(DeleteUnitTypeUseCase);
};
