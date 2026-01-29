import { AddressEntity } from "../Address";
import { CreateAddressDTO } from "../DTOs/CreateAddressDTO";

export interface IAddressRepository {
    create(companyId: number, data: CreateAddressDTO): Promise<AddressEntity>;
    update(id: number, data: Partial<CreateAddressDTO>): Promise<AddressEntity>;
    delete(id: number): Promise<void>;
}
