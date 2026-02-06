import { Container } from "inversify";
import { TYPES } from "../types";
import { IFamilyRepository } from "@/domain/entities/families/repositories/families.interface.repository";
import { FamilyRepositoryCrud } from "@/infrastructure/repositories/families/FamilyRepositoryCrud";
import { IndexFamiliesUseCase } from "@/application/use_cases/families/IndexFamiliesUseCase";
import { CreateFamilyUseCase } from "@/application/use_cases/families/CreateFamilyUseCase";
import { UpdateFamilyUseCase } from "@/application/use_cases/families/UpdateFamilyUseCase";

import { ShowFamilyUseCase } from "@/application/use_cases/families/ShowFamilyUseCase";

export const registerFamilyModule = (container: Container) => {
    container
        .bind<IFamilyRepository>(TYPES.FamilyRepository)
        .to(FamilyRepositoryCrud);
    container
        .bind<IndexFamiliesUseCase>(TYPES.IndexFamiliesUseCase)
        .to(IndexFamiliesUseCase);
    container
        .bind<ShowFamilyUseCase>(TYPES.ShowFamilyUseCase)
        .to(ShowFamilyUseCase);
    container
        .bind<CreateFamilyUseCase>(TYPES.CreateFamilyUseCase)
        .to(CreateFamilyUseCase);
    container
        .bind<UpdateFamilyUseCase>(TYPES.UpdateFamilyUseCase)
        .to(UpdateFamilyUseCase);
};
