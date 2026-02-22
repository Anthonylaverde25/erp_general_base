import { CreateUnitDTO, UpdateUnitDTO } from '../DTOs/UnitDTOs';
import { UnitEntity } from '../UnitEntity';

export interface IUnitRepository {
	index(): Promise<UnitEntity[]>;
	show(id: number): Promise<UnitEntity>;
	create(data: CreateUnitDTO): Promise<UnitEntity>;
	update(id: number, data: UpdateUnitDTO): Promise<UnitEntity>;
	delete(id: number): Promise<void>;
}
