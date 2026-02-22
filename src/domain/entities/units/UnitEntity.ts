import { CreateUnitDTO, UnitDTO } from './DTOs/UnitDTOs';

export class UnitEntity {
	constructor(
		public readonly id: number,
		public readonly company_id: number,
		public readonly unit_type_id: number,
		public readonly code: string,
		public readonly name: string,
		public readonly unit_type_name?: string,
		public readonly unit_type_applicability?: 'physical' | 'service' | 'both'
	) {}

	static fromPrimitives(data: UnitDTO): UnitEntity {
		return new UnitEntity(
			data.id,
			data.company_id,
			data.unit_type_id,
			data.code,
			data.name,
			data.unit_type?.name,
			data.unit_type?.applicability
		);
	}

	static create(data: CreateUnitDTO): UnitEntity {
		return new UnitEntity(
			0, // Temporary ID
			0, // Temporary Company ID
			data.unit_type_id,
			data.code,
			data.name
		);
	}

	toPlainObject(): UnitDTO {
		return {
			id: this.id,
			company_id: this.company_id,
			unit_type_id: this.unit_type_id,
			code: this.code,
			name: this.name,
			unit_type: this.unit_type_name
				? {
						id: this.unit_type_id,
						name: this.unit_type_name,
						applicability: this.unit_type_applicability || 'both'
					}
				: undefined
		};
	}
}
