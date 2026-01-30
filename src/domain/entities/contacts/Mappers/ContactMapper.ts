import { ContactEntity } from "../Contact";

interface ContactListDTO {
    id?: number;
    email: string;
    phone?: string;
    default?: boolean;
}

export class ContactMapper {
    static fromDetailDTO(dto: ContactListDTO): ContactEntity {
        return new ContactEntity(
            dto.id,
            dto.email,
            dto.phone,
            dto.default || false
        );
    }

    static fromDetailDTOList(dtos: ContactListDTO[]): ContactEntity[] {
        return dtos.map((dto) => this.fromDetailDTO(dto));
    }
}
