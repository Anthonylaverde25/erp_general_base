import { FamilyEntity } from '@/domain/entities/families/FamilyEntity';
import { FamilyDTO } from '@/domain/entities/families/DTOs/FamilyDTOs';
import { TaxRateEntity } from '@/domain/entities/tax_rates/TaxRateEntity';

export class FamilyMapper {
	static fromDTO(dto: FamilyDTO): FamilyEntity {
		return new FamilyEntity(
			dto.id,
			dto.company_id,
			dto.tax_rate_ids || (dto.tax_rates ? dto.tax_rates.map((r) => r.id) : []),
			dto.name,
			Number(dto.percentage),
			dto.is_active,
			dto.tax_rates ? dto.tax_rates.map((rate) => TaxRateEntity.fromPrimitives(rate)) : undefined
		);
	}

	static fromDTOList(dtos: FamilyDTO[]): FamilyEntity[] {
		return dtos.map((dto) => FamilyMapper.fromDTO(dto));
	}
}
