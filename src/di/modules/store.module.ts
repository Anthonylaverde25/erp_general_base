import { Container } from 'inversify';
import { TYPES } from '@/di/types';
import { StoreRepositoryCrud } from '@/infrastructure/repositories/stores/StoreRepositoryCrud';
import { IStoreRepository } from '@/domain/entities/stores/repositories/store.interface.repository';
import { IndexStoresUseCase } from '@/application/use_cases/stores/IndexStoresUseCase';
import { CreateStoreUseCase } from '@/application/use_cases/stores/CreateStoreUseCase';
import { ShowStoreUseCase } from '@/application/use_cases/stores/ShowStoreUseCase';
import { UpdateStoreUseCase } from '@/application/use_cases/stores/UpdateStoreUseCase';
import { DeleteStoreUseCase } from '@/application/use_cases/stores/DeleteStoreUseCase';

export const registerStoreModule = (container: Container) => {
    // Repository
    container.bind<IStoreRepository>(TYPES.IStoreRepository).to(StoreRepositoryCrud).inSingletonScope();

    // Use Cases
    container.bind<IndexStoresUseCase>(TYPES.IndexStoresUseCase).to(IndexStoresUseCase);
    container.bind<CreateStoreUseCase>(TYPES.CreateStoreUseCase).to(CreateStoreUseCase);
    container.bind<ShowStoreUseCase>(TYPES.ShowStoreUseCase).to(ShowStoreUseCase);
    container.bind<UpdateStoreUseCase>(TYPES.UpdateStoreUseCase).to(UpdateStoreUseCase);
    container.bind<DeleteStoreUseCase>(TYPES.DeleteStoreUseCase).to(DeleteStoreUseCase);
};
