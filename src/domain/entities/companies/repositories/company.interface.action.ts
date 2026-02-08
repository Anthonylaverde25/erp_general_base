import { ICompany } from "@/types/company.types";
import { AddressEntity } from "../../addresses/Address";
import { BankAccountEntity } from "../../bank_accounts/BankAccount";


export interface ICompanyActionRepository {
    changeCompany(companyId: ICompany['id']): Promise<string>;
    createAddress(companyId: ICompany['id'], data: AddressEntity): Promise<{ address: AddressEntity, message: string }>;
    createBankAccount(data: BankAccountEntity): Promise<{ bank_account: BankAccountEntity; message: string }>;

    changeDefaultAddress(addressId: number): Promise<{ status: number; message: string }>;
    changeDefaultContact(contactId: number): Promise<{ status: number; message: string }>;
}