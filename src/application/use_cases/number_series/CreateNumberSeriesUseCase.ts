import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { INumberSeriesRepository } from '@/domain/entities/number_series/repositories/number-series.interface.repository';
import { NumberSeriesEntity } from '@/domain/entities/number_series/NumberSeriesEntity';
import { CreateNumberSeriesDTO } from '@/domain/entities/number_series/DTOs/CreateNumberSeriesDTO';

@injectable()
export class CreateNumberSeriesUseCase
	implements IUseCase<CreateNumberSeriesDTO, { number_series: NumberSeriesEntity; message: string }>
{
	constructor(
		@inject(TYPES.INumberSeriesRepository)
		private readonly repository: INumberSeriesRepository
	) {}

	async execute(data: CreateNumberSeriesDTO): Promise<{ number_series: NumberSeriesEntity; message: string }> {
		return await this.repository.create(data);
	}
}
