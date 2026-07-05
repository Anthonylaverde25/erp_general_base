import { Container } from 'inversify';
import { TYPES } from '../types';
import { IUserCrudRepository } from '@/domain/entities/users/repositories/user.interface.crud';
import { UserRepositoryCrud } from '@/infrastructure/repositories/users/UserRepositoryCrud';
import { IndexUserUseCase } from '@/application/use_cases/users/IndexUserUseCase';
import { CreateUserUseCase } from '@/application/use_cases/users/CreateUserUseCase';
import { UpdateUserUseCase } from '@/application/use_cases/users/UpdateUserUseCase';
import { ShowUserUseCase } from '@/application/use_cases/users/ShowUserUseCase';
import { AssociateEmployeesUseCase } from '@/application/use_cases/users/AssociateEmployeesUseCase';
import { UpdateUserPermissionsUseCase } from '@/application/use_cases/users/UpdateUserPermissionsUseCase';

export const registerUserModule = (container: Container) => {
	// //Repositories
	container.bind<IUserCrudRepository>(TYPES.IUserCrudRepository).to(UserRepositoryCrud).inSingletonScope();
	// container.bind<IUserCrudRepository>(TYPES.IUserCrudRepository).to(UserRepositoryCrud).inSingletonScope()

	// // Use Cases
	container.bind<IndexUserUseCase>(TYPES.IndexUserUseCase).to(IndexUserUseCase);
	container.bind<CreateUserUseCase>(TYPES.CreateUserUseCase).to(CreateUserUseCase);
	container.bind<UpdateUserUseCase>(TYPES.UpdateUserUseCase).to(UpdateUserUseCase);
	container.bind<ShowUserUseCase>(TYPES.ShowUserUseCase).to(ShowUserUseCase);
	container.bind<AssociateEmployeesUseCase>(TYPES.AssociateEmployeesUseCase).to(AssociateEmployeesUseCase);
	container.bind<UpdateUserPermissionsUseCase>(TYPES.UpdateUserPermissionsUseCase).to(UpdateUserPermissionsUseCase);
};
