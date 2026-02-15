import { Container } from "inversify";
import { TYPES } from "../types";
import { ICurrencyRepository } from "@/domain/entities/currencies/repositories/currency.interface.repository";
import { CurrencyRepositoryCrud } from "@/infrastructure/repositories/currencies/CurrencyRepositoryCrud";
import { IndexCurrenciesUseCase } from "@/application/use_cases/currencies/IndexCurrenciesUseCase";

export function registerCurrenciesModule(container: Container) {
    // Repository
    container
        .bind<ICurrencyRepository>(TYPES.ICurrencyRepository)
        .to(CurrencyRepositoryCrud);

    // Use Cases
    container
        .bind<IndexCurrenciesUseCase>(TYPES.IndexCurrenciesUseCase)
        .to(IndexCurrenciesUseCase);
}
