import { Address } from "@/types/company.types";
import { AddressEntity } from "../Address";
import { CreateAddressDTO } from "../DTOs/CreateAddressDTO";

export interface IAddressRepository {
    create(companyId: number, data: CreateAddressDTO): Promise<{ address: AddressEntity; message: string }>;
    show(id: Address['id']): Promise<AddressEntity>;
    update(id: Address['id'], data: Partial<AddressEntity>): Promise<{ address: AddressEntity, message: string }>;
    delete(id: number): Promise<void>;
}
