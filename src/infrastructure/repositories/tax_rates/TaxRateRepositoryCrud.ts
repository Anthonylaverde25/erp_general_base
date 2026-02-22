import { injectable } from 'inversify';
import axiosInstance from '@/lib/@axios';
import { ITaxRateRepository } from '@/domain/entities/tax_rates/repositories/tax-rates.interface.repository';
import { TaxRateEntity, TaxRate } from '@/domain/entities/tax_rates/TaxRateEntity';
import { TaxRateMapper } from '@/domain/entities/tax_rates/Mappers/TaxRateMapper';
import { CreateTaxRateDTO } from '@/domain/entities/tax_rates/DTOs/CreateTaxRateDTO';

@injectable()
export class TaxRateRepositoryCrud implements ITaxRateRepository {
	async index(): Promise<TaxRateEntity[]> {
		const {
			data: { tax_rates }
		} = await axiosInstance.get(`tax-rates`);
		return TaxRateMapper.fromDetailDTOList(tax_rates);
	}

	async create(data: CreateTaxRateDTO): Promise<{ tax_rate: TaxRateEntity; message: string }> {
		const {
			data: { tax_rate, message }
		} = await axiosInstance.post(`tax-rates`, data);
		return {
			tax_rate: TaxRateMapper.fromDetailDTO(tax_rate),
			message
		};
	}

	async update(id: TaxRate['id'], data: Partial<TaxRate>): Promise<{ tax_rate: TaxRateEntity; message: string }> {
		const {
			data: { tax_rate, message }
		} = await axiosInstance.put(`tax-rates/${id}`, data);
		console.log('mensaje al actualizar el tax rate', message);
		return {
			tax_rate: TaxRateMapper.fromDetailDTO(tax_rate),
			message
		};
	}
}
