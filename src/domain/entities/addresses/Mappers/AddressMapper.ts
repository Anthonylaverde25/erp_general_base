import { AddressEntity } from "../Address";


interface AddressListDTO {
    id?: number;
    street: string;
    street_2?: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    default: boolean;
}
export class AddressMapper {
    static fromDetailDTO(dto: AddressListDTO): AddressEntity {
        return new AddressEntity(
            dto.id,
            dto.street,
            dto.street_2,
            dto.city,
            dto.state,
            dto.postal_code,
            dto.country,
            dto.default


        );
    }

    static fromDetailDTOList(dtos: AddressListDTO[]): AddressEntity[] {
        return dtos.map((dto) => this.fromDetailDTO(dto));
    }
}