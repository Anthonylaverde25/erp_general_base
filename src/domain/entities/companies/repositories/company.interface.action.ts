import { Company } from "../Company";
import { AddressEntity } from "../../addresses/Address";

export interface ICompanyActionRepository {
    changeCompany(companyId: Company['id']): Promise<string>;
    createAddress(companyId: Company['id'], data: AddressEntity): Promise<{ address: AddressEntity, message: string }>;
    changeDefaultAddress(addressId: number): Promise<{ status: number; message: string }>;
    changeDefaultContact(contactId: number): Promise<{ status: number; message: string }>;
}