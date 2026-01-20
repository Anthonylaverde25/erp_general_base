import { Container } from 'inversify';
import { TYPES } from '../types';
import { RoleRepositoryCrud } from '@/infrastructure/repositories/roles/role.repository.crud';
import { IRoleCrudRepository } from '@/domain/entities/roles/repositories/role.interface.crud';
import { IndexRoleUseCase } from '@/application/use_cases/roles/IndexRoleUseCase';
import { CreateRoleUseCase } from '@/application/use_cases/roles/CreateRoleUseCase';
import { UpdateRoleUseCase } from '@/application/use_cases/roles/UpdateRoleUseCase';

export const registerRoleModule = (container: Container) => {
	container.bind<IRoleCrudRepository>(TYPES.IRoleCrudRepository).to(RoleRepositoryCrud).inSingletonScope();
	container.bind<IndexRoleUseCase>(TYPES.IndexRoleUseCase).to(IndexRoleUseCase);
	container.bind<CreateRoleUseCase>(TYPES.CreateRoleUseCase).to(CreateRoleUseCase);
	container.bind<UpdateRoleUseCase>(TYPES.UpdateRoleUseCase).to(UpdateRoleUseCase);
};
