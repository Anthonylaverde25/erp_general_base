import { AddressEntity } from '../Address';

interface AddressListDTO {
	id?: number;
	street: string;
	street_2?: string | null;
	city: string;
	state: string;
	postal_code: string;
	country: string;
	county?: string | null;
	default: boolean;
}
export class AddressMapper {
	static fromDetailDTO(dto: AddressListDTO): AddressEntity {
		return new AddressEntity(
			dto.id,
			dto.street,
			dto.city,
			dto.state,
			dto.postal_code,
			dto.country,
			dto.default,
			dto.street_2,
			dto.county
		);
	}

	static fromDetailDTOList(dtos: AddressListDTO[]): AddressEntity[] {
		return dtos.map((dto) => this.fromDetailDTO(dto));
	}
}
