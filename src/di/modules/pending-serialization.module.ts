import { Container } from 'inversify';
import { TYPES } from '../types';
import { IndexPendingSerializationUseCase } from '@/application/use_cases/pending-serialization/IndexPendingSerializationUseCase';
import { RegisterItemSerialsUseCase } from '@/application/use_cases/pending-serialization/RegisterItemSerialsUseCase';
import { IndexItemSerialsUseCase } from '@/application/use_cases/items/IndexItemSerialsUseCase';

export function registerPendingSerializationModule(container: Container) {
	// Use Cases
	container.bind<IndexPendingSerializationUseCase>(TYPES.IndexPendingSerializationUseCase).to(IndexPendingSerializationUseCase);
	container.bind<RegisterItemSerialsUseCase>(TYPES.RegisterItemSerialsUseCase).to(RegisterItemSerialsUseCase);
	container.bind<IndexItemSerialsUseCase>(TYPES.IndexItemSerialsUseCase).to(IndexItemSerialsUseCase);
}
