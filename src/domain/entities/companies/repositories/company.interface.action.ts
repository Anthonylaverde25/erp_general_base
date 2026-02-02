import { Company } from "../Company";
import { AddressEntity } from "../../addresses/Address";
import { BankAccountEntity } from "../../bank_accounts/BankAccount";


export interface ICompanyActionRepository {
    changeCompany(companyId: Company['id']): Promise<string>;
    createAddress(companyId: Company['id'], data: AddressEntity): Promise<{ address: AddressEntity, message: string }>;
    createBankAccount(data: BankAccountEntity): Promise<{ bank_account: BankAccountEntity; message: string }>;

    changeDefaultAddress(addressId: number): Promise<{ status: number; message: string }>;
    changeDefaultContact(contactId: number): Promise<{ status: number; message: string }>;
}