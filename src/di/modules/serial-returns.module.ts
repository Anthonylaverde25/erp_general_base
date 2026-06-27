import { Container } from 'inversify';
import { TYPES } from '../types';
import { ISerialReturnRepository } from '@/domain/entities/serial-returns/repositories/serial-returns.interface.repository';
import { SerialReturnRepositoryCrud } from '@/infrastructure/repositories/serial-returns/SerialReturnRepositoryCrud';
import { IndexSerialReturnsUseCase } from '@/application/use_cases/serial-returns/IndexSerialReturnsUseCase';
import { IndexItemReturnReasonsUseCase } from '@/application/use_cases/serial-returns/IndexItemReturnReasonsUseCase';
import { ProcessSerialReturnUseCase } from '@/application/use_cases/serial-returns/ProcessSerialReturnUseCase';

export function registerSerialReturnsModule(container: Container) {
	// Repositories
	container.bind<ISerialReturnRepository>(TYPES.SerialReturnRepository).to(SerialReturnRepositoryCrud).inSingletonScope();

	// Use Cases
	container.bind<IndexSerialReturnsUseCase>(TYPES.IndexSerialReturnsUseCase).to(IndexSerialReturnsUseCase);
	container.bind<IndexItemReturnReasonsUseCase>(TYPES.IndexItemReturnReasonsUseCase).to(IndexItemReturnReasonsUseCase);
	container.bind<ProcessSerialReturnUseCase>(TYPES.ProcessSerialReturnUseCase).to(ProcessSerialReturnUseCase);
}
