import { Container } from 'inversify';
import { TYPES } from '../types';
import { IUserCrudRepository } from '@/domain/entities/users/repositories/user.interface.crud';
import { UserRepositoryCrud } from '@/infrastructure/repositories/users/user.repository.crud';
import { IndexUserUseCase } from '@/application/use_cases/user/IndexUserUseCase';
import { CreateUserUseCase } from '@/application/use_cases/user/CreateUserUseCase';
import { UpdateUserUseCase } from '@/application/use_cases/user/UpdateUserUseCase';
import { ShowUserUseCase } from '@/application/use_cases/user/ShowUserUseCase';

export const registerUserModule = (container: Container) => {
	// //Repositories
	container.bind<IUserCrudRepository>(TYPES.IUserCrudRepository).to(UserRepositoryCrud).inSingletonScope();
	// container.bind<IUserCrudRepository>(TYPES.IUserCrudRepository).to(UserRepositoryCrud).inSingletonScope()

	// // Use Cases
	container.bind<IndexUserUseCase>(TYPES.IndexUserUseCase).to(IndexUserUseCase);
	container.bind<CreateUserUseCase>(TYPES.CreateUserUseCase).to(CreateUserUseCase);
	container.bind<UpdateUserUseCase>(TYPES.UpdateUserUseCase).to(UpdateUserUseCase);
	container.bind<ShowUserUseCase>(TYPES.ShowUserUseCase).to(ShowUserUseCase)
};
