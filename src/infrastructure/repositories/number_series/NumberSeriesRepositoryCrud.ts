import { injectable } from 'inversify';
import axiosInstance from '@/lib/@axios';
import { INumberSeriesRepository } from '@/domain/entities/number_series/repositories/number-series.interface.repository';
import { NumberSeriesEntity, NumberSeries } from '@/domain/entities/number_series/NumberSeriesEntity';
import { NumberSeriesMapper } from '@/domain/entities/number_series/Mappers/NumberSeriesMapper';

import { CreateNumberSeriesDTO } from '@/domain/entities/number_series/DTOs/CreateNumberSeriesDTO';

@injectable()
export class NumberSeriesRepositoryCrud implements INumberSeriesRepository {
	async index(documentTypeCode?: string): Promise<NumberSeriesEntity[]> {
		const {
			data: { number_series }
		} = await axiosInstance.get(`number-series`, {
			params: { document_type_code: documentTypeCode }
		});
		return NumberSeriesMapper.fromDetailDTOList(number_series);
	}

	async create(data: CreateNumberSeriesDTO): Promise<{ number_series: NumberSeriesEntity; message: string }> {
		const {
			data: { serie, message }
		} = await axiosInstance.post(`number-series`, data);
		return {
			number_series: NumberSeriesMapper.fromDetailDTO(serie),
			message
		};
	}

	async update(
		id: NumberSeries['id'],
		data: Partial<NumberSeriesEntity>
	): Promise<{ number_series: NumberSeriesEntity; message: string }> {
		const {
			data: { serie, message }
		} = await axiosInstance.put(`number-series/${id}`, data);
		return {
			number_series: NumberSeriesMapper.fromDetailDTO(serie),
			message
		};
	}
}
