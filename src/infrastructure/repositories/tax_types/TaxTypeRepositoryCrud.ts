import { injectable } from 'inversify';
import axiosInstance from '@/lib/@axios';
import { ITaxTypeRepository } from '@/domain/entities/tax_types/repositories/tax-types.interface.repository';
import { TaxTypeEntity, TaxType } from '@/domain/entities/tax_types/TaxTypeEntity';
import { TaxTypeMapper } from '@/domain/entities/tax_types/Mappers/TaxTypeMapper';
import { CreateTaxTypeDTO } from '@/domain/entities/tax_types/DTOs/CreateTaxTypeDTO';

@injectable()
export class TaxTypeRepositoryCrud implements ITaxTypeRepository {
	async index(): Promise<TaxTypeEntity[]> {
		const {
			data: { tax_types }
		} = await axiosInstance.get(`tax-types`);
		return TaxTypeMapper.fromDetailDTOList(tax_types);
	}

	async create(data: CreateTaxTypeDTO): Promise<{ tax_type: TaxTypeEntity; message: string }> {
		const {
			data: { tax_type, message }
		} = await axiosInstance.post(`tax-types`, data);
		return {
			tax_type: TaxTypeMapper.fromDetailDTO(tax_type),
			message
		};
	}

	async update(
		id: TaxType['id'],
		data: Partial<TaxTypeEntity>
	): Promise<{ tax_type: TaxTypeEntity; message: string }> {
		const {
			data: { tax_type, message }
		} = await axiosInstance.put(`tax-types/${id}`, data);
		return {
			tax_type: TaxTypeMapper.fromDetailDTO(tax_type),
			message
		};
	}

	async changeStatus(id: number): Promise<{ id: number; is_active: boolean; message: string }> {
		const {
			data: { id: returnedId, is_active, message }
		} = await axiosInstance.put(`tax-types/${id}/toggle-status`);
		return {
			id: returnedId,
			is_active,
			message
		};
	}
}
