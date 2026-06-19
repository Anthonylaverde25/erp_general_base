import { Container } from 'inversify';
import { TYPES } from '../types';
import { IBatchRepository } from '@/domain/entities/batches/repositories/batch.interface.repository';
import { BatchRepositoryCrud } from '@/infrastructure/repositories/batches/BatchRepositoryCrud';
import { IndexBatchesUseCase } from '@/application/use_cases/batches/IndexBatchesUseCase';
import { ShowBatchUseCase } from '@/application/use_cases/batches/ShowBatchUseCase';
import { UpdateBatchUseCase } from '@/application/use_cases/batches/UpdateBatchUseCase';

export function registerBatchModule(container: Container) {
	// Repositories
	container.bind<IBatchRepository>(TYPES.BatchRepository).to(BatchRepositoryCrud).inSingletonScope();

	// Use Cases
	container.bind<IndexBatchesUseCase>(TYPES.IndexBatchesUseCase).to(IndexBatchesUseCase);
	container.bind<ShowBatchUseCase>(TYPES.ShowBatchUseCase).to(ShowBatchUseCase);
	container.bind<UpdateBatchUseCase>(TYPES.UpdateBatchUseCase).to(UpdateBatchUseCase);
}
