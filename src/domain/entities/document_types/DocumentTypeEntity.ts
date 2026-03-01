export interface DocumentType {
	id: number;
	name: string;
	code: string;
	description: string;
	module: string;
}

export class DocumentTypeEntity implements DocumentType {
	constructor(
		public id: number,
		public name: string,
		public code: string,
		public description: string,
		public module: string
	) { }

	static fromPrimitives(data: DocumentType): DocumentTypeEntity {
		return new DocumentTypeEntity(data.id, data.name, data.code, data.description, data.module);
	}

	toPlainObject(): DocumentType {
		return {
			id: this.id,
			name: this.name,
			code: this.code,
			description: this.description,
			module: this.module
		};
	}
}
