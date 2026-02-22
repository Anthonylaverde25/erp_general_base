import { TaxTypeEntity, TaxType } from '../TaxTypeEntity';

export class TaxTypeMapper {
	static fromDetailDTO(data: TaxType): TaxTypeEntity {
		return TaxTypeEntity.fromPrimitives(data);
	}

	static fromDetailDTOList(data: TaxType[]): TaxTypeEntity[] {
		return data.map((item) => TaxTypeMapper.fromDetailDTO(item));
	}
}
