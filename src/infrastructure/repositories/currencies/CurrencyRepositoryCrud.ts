import { injectable } from 'inversify';
import axiosInstance from '@/lib/@axios';
import { ICurrencyRepository } from '@/domain/entities/currencies/repositories/currency.interface.repository';
import { CurrencyEntity } from '@/domain/entities/currencies/CurrencyEntity';
import { CurrencyMapper } from '@/domain/entities/currencies/Mappers/CurrencyMapper';

@injectable()
export class CurrencyRepositoryCrud implements ICurrencyRepository {
    async index(): Promise<CurrencyEntity[]> {
        const { data: { currencies } } = await axiosInstance.get('currencies');
        return CurrencyMapper.fromDetailDTOList(currencies);
    }
}
