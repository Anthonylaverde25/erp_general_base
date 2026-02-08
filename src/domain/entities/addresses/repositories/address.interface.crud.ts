import { IAddress } from "@/types/company.types";
import { AddressEntity } from "../Address";
import { CreateAddressDTO } from "../DTOs/CreateAddressDTO";

export interface IAddressRepository {
    create(companyId: number, data: CreateAddressDTO): Promise<{ address: AddressEntity; message: string }>;
    show(id: IAddress['id']): Promise<AddressEntity>;
    update(id: IAddress['id'], data: Partial<AddressEntity>): Promise<{ address: AddressEntity, message: string }>;
    delete(id: number): Promise<void>;
}
