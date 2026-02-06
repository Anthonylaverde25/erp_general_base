import { TaxRateEntity, TaxRate } from "../TaxRateEntity";

export class TaxRateMapper {
    static fromDetailDTO(data: TaxRate): TaxRateEntity {
        return TaxRateEntity.fromPrimitives(data);
    }

    static fromDetailDTOList(data: TaxRate[]): TaxRateEntity[] {
        return data.map((item) => TaxRateMapper.fromDetailDTO(item));
    }
}
