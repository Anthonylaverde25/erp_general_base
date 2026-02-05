import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import type { INumberSeriesRepository } from '@/domain/entities/number_series/repositories/number-series.interface.repository';
import { NumberSeriesEntity, NumberSeries } from '@/domain/entities/number_series/NumberSeriesEntity';

@injectable()
export class UpdateNumberSeriesUseCase {
    constructor(
        @inject(TYPES.INumberSeriesRepository)
        private numberSeriesRepository: INumberSeriesRepository
    ) { }

    async execute(id: NumberSeries['id'], data: Partial<NumberSeriesEntity>): Promise<{ number_series: NumberSeriesEntity; message: string }> {
        return await this.numberSeriesRepository.update(id, data);
    }
}
