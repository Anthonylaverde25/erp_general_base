import { Container } from "inversify";
import { TYPES } from "../types";
import { RoleRepositoryCrud } from "@/infrastructure/repositories/roles/role.repository.crud";
import { IRoleCrudRepository } from "@/domain/entities/roles/repositories/role.interface.crud";
import { IndexRoleUseCase } from "@/application/use_cases/roles/IndexRoleUseCase";

export const registerRoleModule = (container: Container) => {
    container.bind<IRoleCrudRepository>(TYPES.IRoleCrudRepository).to(RoleRepositoryCrud).inSingletonScope();
    container.bind<IndexRoleUseCase>(TYPES.IndexRoleUseCase).to(IndexRoleUseCase);
};
