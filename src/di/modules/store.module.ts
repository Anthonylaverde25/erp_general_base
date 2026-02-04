import { Container } from 'inversify';
import { TYPES } from '@/di/types';
import { StoreRepositoryCrud } from '@/infrastructure/repositories/stores/StoreRepositoryCrud';
import { IStoreRepository } from '@/domain/entities/stores/repositories/store.interface.repository';
import { IndexStoresUseCase } from '@/application/use_cases/stores/IndexStoresUseCase';

export const registerStoreModule = (container: Container) => {
    // Repository
    container.bind<IStoreRepository>(TYPES.IStoreRepository).to(StoreRepositoryCrud).inSingletonScope();

    // Use Cases
    container.bind<IndexStoresUseCase>(TYPES.IndexStoresUseCase).to(IndexStoresUseCase);
};
