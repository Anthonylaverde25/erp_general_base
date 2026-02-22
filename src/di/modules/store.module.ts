import { Container } from 'inversify';
import { TYPES } from '@/di/types';
import { StoreRepositoryCrud } from '@/infrastructure/repositories/stores/StoreRepositoryCrud';
import { IStoreRepository } from '@/domain/entities/stores/repositories/store.interface.repository';
import { IStoreActionRepository } from '@/domain/entities/stores/repositories/store.action.repository';
import { StoreRepositoryAction } from '@/infrastructure/repositories/stores/StoreRepositoryAction';
import { IndexStoresUseCase } from '@/application/use_cases/stores/IndexStoresUseCase';
import { CreateStoreUseCase } from '@/application/use_cases/stores/CreateStoreUseCase';
import { ShowStoreUseCase } from '@/application/use_cases/stores/ShowStoreUseCase';
import { UpdateStoreUseCase } from '@/application/use_cases/stores/UpdateStoreUseCase';
import { DeleteStoreUseCase } from '@/application/use_cases/stores/DeleteStoreUseCase';
import { ToggleStoreStatusUseCase } from '@/application/use_cases/stores/ToggleStoreStatusUseCase';
import { RemoveAddressUseCase } from '@/application/use_cases/stores/RemoveAddressUseCase';

export const registerStoreModule = (container: Container) => {
	// Repository
	container.bind<IStoreRepository>(TYPES.IStoreRepository).to(StoreRepositoryCrud).inSingletonScope();
	container.bind<IStoreActionRepository>(TYPES.IStoreActionRepository).to(StoreRepositoryAction);

	// Use Cases
	container.bind<IndexStoresUseCase>(TYPES.IndexStoresUseCase).to(IndexStoresUseCase);
	container.bind<CreateStoreUseCase>(TYPES.CreateStoreUseCase).to(CreateStoreUseCase);
	container.bind<ShowStoreUseCase>(TYPES.ShowStoreUseCase).to(ShowStoreUseCase);
	container.bind<UpdateStoreUseCase>(TYPES.UpdateStoreUseCase).to(UpdateStoreUseCase);
	container.bind<DeleteStoreUseCase>(TYPES.DeleteStoreUseCase).to(DeleteStoreUseCase);
	container.bind<ToggleStoreStatusUseCase>(TYPES.ToggleStoreStatusUseCase).to(ToggleStoreStatusUseCase);
	container.bind<RemoveAddressUseCase>(TYPES.RemoveAddressUseCase).to(RemoveAddressUseCase);
};
