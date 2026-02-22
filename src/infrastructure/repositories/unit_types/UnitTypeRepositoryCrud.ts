import { IUnitTypeRepository } from '@/domain/entities/unit_types/repositories/unit_type.interface.repository';
import { UnitTypeEntity } from '@/domain/entities/unit_types/UnitTypeEntity';
import { CreateUnitTypeDTO, UpdateUnitTypeDTO } from '@/domain/entities/unit_types/DTOs/UnitTypeDTOs';
import { UnitTypeMapper } from '@/infrastructure/mappers/unit_types/UnitTypeMapper';
import axios from '@/lib/@axios';

export class UnitTypeRepositoryCrud implements IUnitTypeRepository {
	async index(): Promise<UnitTypeEntity[]> {
		const {
			data: { unit_types }
		} = await axios.get('/unit-types');
		return UnitTypeMapper.fromDTOList(unit_types);
	}

	async show(id: number): Promise<UnitTypeEntity> {
		const {
			data: { unit_type }
		} = await axios.get(`/unit-types/${id}`);
		return UnitTypeMapper.fromDTO(unit_type);
	}

	async create(data: CreateUnitTypeDTO): Promise<UnitTypeEntity> {
		const payload = UnitTypeMapper.toCreateDTO(data);
		const {
			data: { unit_type }
		} = await axios.post('/unit-types', payload);
		return UnitTypeMapper.fromDTO(unit_type);
	}

	async update(id: number, data: UpdateUnitTypeDTO): Promise<UnitTypeEntity> {
		const payload = UnitTypeMapper.toUpdateDTO(data);
		const {
			data: { unit_type }
		} = await axios.put(`/unit-types/${id}`, payload);
		return UnitTypeMapper.fromDTO(unit_type);
	}

	async delete(id: number): Promise<void> {
		await axios.delete(`/unit-types/${id}`);
	}
}
