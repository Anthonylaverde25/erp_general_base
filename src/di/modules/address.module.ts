import { Container } from 'inversify';
import { TYPES } from '@/di/types';
import { AddressRepositoryCrud } from '@/infrastructure/repositories/addresses/AddressRepositoryCrud';
import { IAddressRepository } from '@/domain/entities/addresses/repositories/address.interface.crud';
import { CreateAddressUseCase } from '@/application/use_cases/addresses/CreateAddressUseCase';
import { ShowAddressUseCase } from '@/application/use_cases/addresses/ShowAddressUseCase';
import { UpdateAddressUseCase } from '@/application/use_cases/addresses/UpdateAddressUseCase';
import { DeleteAddressUseCase } from '@/application/use_cases/addresses/DeleteAddressUseCase';

export const registerAddressModule = (container: Container) => {
    // Repository
    container.bind<IAddressRepository>(TYPES.IAddressRepository).to(AddressRepositoryCrud).inSingletonScope();

    // Use Cases
    container.bind<CreateAddressUseCase>(TYPES.CreateAddressUseCase).to(CreateAddressUseCase);
    container.bind<ShowAddressUseCase>(TYPES.ShowAddressUseCase).to(ShowAddressUseCase);
    container.bind<UpdateAddressUseCase>(TYPES.UpdateAddressUseCase).to(UpdateAddressUseCase);
    container.bind<DeleteAddressUseCase>(TYPES.DeleteAddressUseCase).to(DeleteAddressUseCase);
};
