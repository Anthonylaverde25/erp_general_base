import { DocumentTypeMapper } from "../../document_types/Mappers/DocumentTypeMapper";
import { NumberSeriesEntity } from "../NumberSeriesEntity";

export class NumberSeriesMapper {
    static fromDetailDTO(data: any): NumberSeriesEntity {
        return NumberSeriesEntity.fromPrimitives({
            id: data.id,
            company_id: data.company_id,
            document_type_id: data.document_type_id,
            serie: data.serie,
            year: data.year,
            current_number: data.current_number,
            terms: data.terms,
            document_type: data.document_type ? DocumentTypeMapper.fromDetailDTO(data.document_type) : undefined,
        });
    }

    static fromDetailDTOList(data: any[]): NumberSeriesEntity[] {
        return data.map((item) => NumberSeriesMapper.fromDetailDTO(item));
    }
}
