import { DocumentTypeEntity } from '../DocumentTypeEntity';

export class DocumentTypeMapper {
	static fromDetailDTO(data: any): DocumentTypeEntity {
		return DocumentTypeEntity.fromPrimitives({
			id: data.id,
			name: data.name,
			code: data.code,
			description: data.description,
			module: data.module
		});
	}

	static fromDetailDTOList(data: any[]): DocumentTypeEntity[] {
		return data.map((item) => DocumentTypeMapper.fromDetailDTO(item));
	}
}
