import { CurrencyEntity } from '../CurrencyEntity';

export interface ICurrencyRepository {
	index(): Promise<CurrencyEntity[]>;
}
