import { Container } from 'inversify';
import { TYPES } from '@/di/types';
import { ContactRepositoryCrud } from '@/infrastructure/repositories/contacts/ContactRepositoryCrud';
import { IContactRepository } from '@/domain/entities/contacts/repositories/contact.interface.repository';
import { CreateContactUseCase } from '@/application/use_cases/contacts/CreateContactUseCase';
import { ShowContactUseCase } from '@/application/use_cases/contacts/ShowContactUseCase';
import { UpdateContactUseCase } from '@/application/use_cases/contacts/UpdateContactUseCase';
import { DeleteContactUseCase } from '@/application/use_cases/contacts/DeleteContactUseCase';

export const registerContactModule = (container: Container) => {
	// Repository
	container.bind<IContactRepository>(TYPES.IContactRepository).to(ContactRepositoryCrud).inSingletonScope();

	// Use Cases
	container.bind<CreateContactUseCase>(TYPES.CreateContactUseCase).to(CreateContactUseCase);
	container.bind<ShowContactUseCase>(TYPES.ShowContactUseCase).to(ShowContactUseCase);
	container.bind<UpdateContactUseCase>(TYPES.UpdateContactUseCase).to(UpdateContactUseCase);
	container.bind<DeleteContactUseCase>(TYPES.DeleteContactUseCase).to(DeleteContactUseCase);
};
