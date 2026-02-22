import { Container } from 'inversify';
import { TYPES } from '../types';
import { IFamilyRepository } from '@/domain/entities/families/repositories/families.interface.repository';
import { IFamilyActionRepository } from '@/domain/entities/families/repositories/family.action.repository';
import { FamilyRepositoryCrud } from '@/infrastructure/repositories/families/FamilyRepositoryCrud';
import { FamilyRepositoryAction } from '@/infrastructure/repositories/families/FamilyRepositoryAction';
import { IndexFamiliesUseCase } from '@/application/use_cases/families/IndexFamiliesUseCase';
import { CreateFamilyUseCase } from '@/application/use_cases/families/CreateFamilyUseCase';
import { UpdateFamilyUseCase } from '@/application/use_cases/families/UpdateFamilyUseCase';
import { ToggleFamilyStatusUseCase } from '@/application/use_cases/families/ToggleFamilyStatusUseCase';

import { ShowFamilyUseCase } from '@/application/use_cases/families/ShowFamilyUseCase';

export const registerFamilyModule = (container: Container) => {
	container.bind<IFamilyRepository>(TYPES.FamilyRepository).to(FamilyRepositoryCrud);
	container.bind<IndexFamiliesUseCase>(TYPES.IndexFamiliesUseCase).to(IndexFamiliesUseCase);
	container.bind<ShowFamilyUseCase>(TYPES.ShowFamilyUseCase).to(ShowFamilyUseCase);
	container.bind<CreateFamilyUseCase>(TYPES.CreateFamilyUseCase).to(CreateFamilyUseCase);
	container.bind<UpdateFamilyUseCase>(TYPES.UpdateFamilyUseCase).to(UpdateFamilyUseCase);
	container.bind<IFamilyActionRepository>(TYPES.IFamilyActionRepository).to(FamilyRepositoryAction);
	container.bind<ToggleFamilyStatusUseCase>(TYPES.ToggleFamilyStatusUseCase).to(ToggleFamilyStatusUseCase);
};
