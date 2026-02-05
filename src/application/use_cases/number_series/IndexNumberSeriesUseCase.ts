import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '@/application/use_cases/IUseCase';
import type { INumberSeriesRepository } from '@/domain/entities/number_series/repositories/number-series.interface.repository';
import { NumberSeriesEntity } from '@/domain/entities/number_series/NumberSeriesEntity';

@injectable()
export class IndexNumberSeriesUseCase implements IUseCase<void, NumberSeriesEntity[]> {
    constructor(
        @inject(TYPES.INumberSeriesRepository)
        private readonly repository: INumberSeriesRepository
    ) { }

    async execute(): Promise<NumberSeriesEntity[]> {
        return await this.repository.index();
    }
}
