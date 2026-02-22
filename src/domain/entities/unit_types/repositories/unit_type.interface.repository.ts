import { CreateUnitTypeDTO, UpdateUnitTypeDTO } from '../DTOs/UnitTypeDTOs';
import { UnitTypeEntity } from '../UnitTypeEntity';

export interface IUnitTypeRepository {
	index(): Promise<UnitTypeEntity[]>;
	show(id: number): Promise<UnitTypeEntity>;
	create(data: CreateUnitTypeDTO): Promise<UnitTypeEntity>;
	update(id: number, data: UpdateUnitTypeDTO): Promise<UnitTypeEntity>;
	delete(id: number): Promise<void>;
}
