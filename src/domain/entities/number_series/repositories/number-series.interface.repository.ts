import { NumberSeriesEntity } from '../NumberSeriesEntity';
import { NumberSeries } from '../NumberSeriesEntity';

import { CreateNumberSeriesDTO } from '../DTOs/CreateNumberSeriesDTO';

export interface INumberSeriesRepository {
	index(): Promise<NumberSeriesEntity[]>;
	create(data: CreateNumberSeriesDTO): Promise<{ number_series: NumberSeriesEntity; message: string }>;
	update(
		id: NumberSeries['id'],
		data: Partial<NumberSeriesEntity>
	): Promise<{ number_series: NumberSeriesEntity; message: string }>;
}
