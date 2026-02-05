import { Container } from "inversify";
import { TYPES } from "../types";
import { INumberSeriesRepository } from "@/domain/entities/number_series/repositories/number-series.interface.repository";
import { NumberSeriesRepositoryCrud } from "@/infrastructure/repositories/number_series/NumberSeriesRepositoryCrud";
import { IndexNumberSeriesUseCase } from "@/application/use_cases/number_series/IndexNumberSeriesUseCase";
import { CreateNumberSeriesUseCase } from "@/application/use_cases/number_series/CreateNumberSeriesUseCase";

export function registerNumberSeriesModule(container: Container) {
    // Repository
    container
        .bind<INumberSeriesRepository>(TYPES.INumberSeriesRepository)
        .to(NumberSeriesRepositoryCrud);

    // Use Cases
    container
        .bind<IndexNumberSeriesUseCase>(TYPES.IndexNumberSeriesUseCase)
        .to(IndexNumberSeriesUseCase);
    container
        .bind<CreateNumberSeriesUseCase>(TYPES.CreateNumberSeriesUseCase)
        .to(CreateNumberSeriesUseCase);
}
