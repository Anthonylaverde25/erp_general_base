import { Container } from 'inversify';
import { TYPES } from '@/di/types';
import { IUnitRepository } from '@/domain/entities/units/repositories/unit.interface.repository';
import { UnitRepositoryCrud } from '@/infrastructure/repositories/units/UnitRepositoryCrud';
import { IndexUnitsUseCase } from '@/application/useCases/units/IndexUnitsUseCase';
import { CreateUnitUseCase } from '@/application/useCases/units/CreateUnitUseCase';
import { UpdateUnitUseCase } from '@/application/useCases/units/UpdateUnitUseCase';
import { DeleteUnitUseCase } from '@/application/useCases/units/DeleteUnitUseCase';

export const UnitsModule = (container: Container) => {
	container.bind<IUnitRepository>(TYPES.UnitRepository).to(UnitRepositoryCrud);

	container.bind<IndexUnitsUseCase>(TYPES.IndexUnitsUseCase).to(IndexUnitsUseCase);
	container.bind<CreateUnitUseCase>(TYPES.CreateUnitUseCase).to(CreateUnitUseCase);
	container.bind<UpdateUnitUseCase>(TYPES.UpdateUnitUseCase).to(UpdateUnitUseCase);
	container.bind<DeleteUnitUseCase>(TYPES.DeleteUnitUseCase).to(DeleteUnitUseCase);
};
