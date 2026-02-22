import { CurrencyEntity, Currency } from '../CurrencyEntity';

export class CurrencyMapper {
	static fromDetailDTO(data: Currency): CurrencyEntity {
		return CurrencyEntity.fromPrimitives(data);
	}

	static fromDetailDTOList(data: Currency[]): CurrencyEntity[] {
		return data.map((item) => CurrencyMapper.fromDetailDTO(item));
	}
}
