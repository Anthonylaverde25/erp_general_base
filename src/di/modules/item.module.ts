import { Container } from 'inversify';
import { TYPES } from '../types';
import { IItemRepository } from '@/domain/entities/items/repositories/item.repository';
import { IItemActionRepository } from '@/domain/entities/items/repositories/item.action.repository';
import { ItemRepositoryCrud } from '@/infrastructure/repositories/items/ItemRepositoryCrud';
import { ItemRepositoryAction } from '@/infrastructure/repositories/items/ItemRepositoryAction';
import { IndexItemsUseCase } from '@/application/use_cases/items/IndexItemsUseCase';
import { CreateItemUseCase } from '@/application/use_cases/items/CreateItemUseCase';
import { UpdateItemUseCase } from '@/application/use_cases/items/UpdateItemUseCase';
import { ShowItemUseCase } from '@/application/use_cases/items/ShowItemUseCase';
import { UpdateStockAlertUseCase } from '@/application/use_cases/items/UpdateStockAlertUseCase';
import { RegisterStockMovementUseCase } from '@/application/use_cases/items/RegisterStockMovementUseCase';
import { AdjustStockEntryUseCase } from '@/application/use_cases/items/AdjustStockEntryUseCase';

export function registerItemModule(container: Container) {
	// Repositories
	container.bind<IItemRepository>(TYPES.ItemRepository).to(ItemRepositoryCrud).inSingletonScope();

	container.bind<IItemActionRepository>(TYPES.IItemActionRepository).to(ItemRepositoryAction).inSingletonScope();

	// Use Cases
	container.bind<IndexItemsUseCase>(TYPES.IndexItemsUseCase).to(IndexItemsUseCase);
	container.bind<CreateItemUseCase>(TYPES.CreateItemUseCase).to(CreateItemUseCase);
	container.bind<UpdateItemUseCase>(TYPES.UpdateItemUseCase).to(UpdateItemUseCase);
	container.bind<ShowItemUseCase>(TYPES.ShowItemUseCase).to(ShowItemUseCase);
	container.bind<UpdateStockAlertUseCase>(TYPES.UpdateStockAlertUseCase).to(UpdateStockAlertUseCase);
	container.bind<RegisterStockMovementUseCase>(TYPES.RegisterStockMovementUseCase).to(RegisterStockMovementUseCase);
	container.bind<AdjustStockEntryUseCase>(TYPES.AdjustStockEntryUseCase).to(AdjustStockEntryUseCase);
}
