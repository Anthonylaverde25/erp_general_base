import { DocumentTypeEntity } from "../DocumentTypeEntity";

export class DocumentTypeMapper {
    static fromDetailDTO(data: any): DocumentTypeEntity {
        return DocumentTypeEntity.fromPrimitives({
            id: data.id,
            name: data.name,
            code: data.code,
            description: data.description,
            category: data.category,
        });
    }

    static fromDetailDTOList(data: any[]): DocumentTypeEntity[] {
        return data.map((item) => DocumentTypeMapper.fromDetailDTO(item));
    }
}
