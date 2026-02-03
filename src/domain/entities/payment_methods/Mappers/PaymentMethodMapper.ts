import { PaymentMethodEntity } from "../PaymentMethod";

interface PaymentMethodListDTO {
    id?: number;
    company_id?: number;
    name: string;
    type: string;
    description?: string;
    details?: any;
    is_active: boolean;
}

export class PaymentMethodMapper {
    static fromDetailDTO(dto: PaymentMethodListDTO): PaymentMethodEntity {
        return new PaymentMethodEntity(
            dto.id,
            dto.company_id,
            dto.name,
            dto.type,
            dto.description,
            dto.details,
            dto.is_active ?? true
        );
    }

    static fromDetailDTOList(dtos: PaymentMethodListDTO[]): PaymentMethodEntity[] {
        return dtos.map((dto) => this.fromDetailDTO(dto));
    }
}
