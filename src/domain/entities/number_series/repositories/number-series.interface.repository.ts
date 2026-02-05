import { NumberSeriesEntity } from "../NumberSeriesEntity";

import { CreateNumberSeriesDTO } from "../DTOs/CreateNumberSeriesDTO";

export interface INumberSeriesRepository {
    index(): Promise<NumberSeriesEntity[]>;
    create(data: CreateNumberSeriesDTO): Promise<{ number_series: NumberSeriesEntity; message: string }>;
}
