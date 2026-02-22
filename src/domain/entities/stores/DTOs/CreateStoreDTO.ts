import { CreateAddressDTO } from '@/domain/entities/addresses/DTOs/CreateAddressDTO';

export interface CreateStoreDTO {
	name: string;
	code?: string;
	is_active?: boolean;
	address?: CreateAddressDTO;
}
