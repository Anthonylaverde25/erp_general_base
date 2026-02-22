import { IUnitRepository } from '@/domain/entities/units/repositories/unit.interface.repository';
import { UnitEntity } from '@/domain/entities/units/UnitEntity';
import { CreateUnitDTO, UpdateUnitDTO } from '@/domain/entities/units/DTOs/UnitDTOs';
import { UnitMapper } from '@/infrastructure/mappers/units/UnitMapper';
import axios from '@/lib/@axios';

export class UnitRepositoryCrud implements IUnitRepository {
	async index(): Promise<UnitEntity[]> {
		const {
			data: { units }
		} = await axios.get('/units'); // Assuming endpoint is /units
		return UnitMapper.fromDTOList(units);
	}

	async show(id: number): Promise<UnitEntity> {
		const {
			data: { unit }
		} = await axios.get(`/units/${id}`);
		return UnitMapper.fromDTO(unit);
	}

	async create(data: CreateUnitDTO): Promise<UnitEntity> {
		const payload = UnitMapper.toCreateDTO(data);
		const {
			data: { unit }
		} = await axios.post('/units', payload);
		return UnitMapper.fromDTO(unit);
	}

	async update(id: number, data: UpdateUnitDTO): Promise<UnitEntity> {
		const payload = UnitMapper.toUpdateDTO(data);
		const {
			data: { unit }
		} = await axios.put(`/units/${id}`, payload);
		return UnitMapper.fromDTO(unit);
	}

	async delete(id: number): Promise<void> {
		await axios.delete(`/units/${id}`);
	}
}
