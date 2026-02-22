import { UnitDTO } from '@/domain/entities/units/DTOs/UnitDTOs';

export type UnitTypeApplicability = 'physical' | 'service' | 'both';

export interface UnitTypeDTO {
	id: number;
	company_id: number;
	name: string;
	description: string | null;
	applicability: UnitTypeApplicability;
	is_active: boolean;
	units?: UnitDTO[];
}

export interface CreateUnitTypeDTO {
	name: string;
	description?: string | null;
	applicability: UnitTypeApplicability;
	is_active?: boolean;
}

export interface UpdateUnitTypeDTO {
	name?: string;
	description?: string | null;
	applicability?: UnitTypeApplicability;
	is_active?: boolean;
}
