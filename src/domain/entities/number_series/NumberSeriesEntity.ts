import { DocumentTypeEntity } from '../document_types/DocumentTypeEntity';

export interface NumberSeries {
	id: number;
	company_id: number;
	document_type_id: number;
	serie: string;
	year: number;
	current_number: number;
	terms: string;
	document_type?: DocumentTypeEntity;
}

export class NumberSeriesEntity implements NumberSeries {
	constructor(
		public id: number,
		public company_id: number,
		public document_type_id: number,
		public serie: string,
		public year: number,
		public current_number: number,
		public terms: string,
		public document_type?: DocumentTypeEntity
	) {}

	static fromPrimitives(data: NumberSeries): NumberSeriesEntity {
		return new NumberSeriesEntity(
			data.id,
			data.company_id,
			data.document_type_id,
			data.serie,
			data.year,
			data.current_number,
			data.terms,
			data.document_type ? DocumentTypeEntity.fromPrimitives(data.document_type) : undefined
		);
	}

	toPlainObject(): NumberSeries {
		return {
			id: this.id,
			company_id: this.company_id,
			document_type_id: this.document_type_id,
			serie: this.serie,
			year: this.year,
			current_number: this.current_number,
			terms: this.terms,
			document_type: this.document_type
		};
	}
}
