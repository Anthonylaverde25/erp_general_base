import { CreateAddressDTO } from "@/domain/entities/addresses/DTOs/CreateAddressDTO";
import { CreateContactDTO } from "@/domain/entities/contacts/DTOs/CreateContactDTO";
import { IBankAccount, ICreateBankAccount, IUpdateBankAccount } from "@/types/bank_account.types";

export type PartnerType = 'company' | 'person' | 'public_organism' | 'prospect';

export type PartnerRole = 'client' | 'supplier' | 'client_supplier' | 'prospect';

export interface PartnerDTO {
    id: number;
    company_id: number;
    name: string;
    comercial_name: string;
    vat_number: string;
    cif: string;
    role: PartnerRole;
    payment_method_id: number;
    type: PartnerType;
    website?: string;
    address: any[]; // We will map this in the mapper
    contact: any[]; // We will map this in the mapper
    bank_accounts: IBankAccount[]; // We will map this in the mapper
    roles?: { role: string; status: string }[];
}

export interface CreatePartnerDTO {
    company_id: number;
    name: string;
    comercial_name: string;
    vat_number: string;
    cif: string;
    role: PartnerRole;
    payment_method_id: number;
    type: PartnerType;
    website?: string;
    address?: CreateAddressDTO[];
    contact?: CreateContactDTO[];
    bank_accounts?: ICreateBankAccount[];
}

export interface UpdatePartnerDTO {
    company_id?: number;
    name?: string;
    comercial_name?: string;
    vat_number?: string;
    cif?: string;
    role?: PartnerRole;
    payment_method_id?: number;
    type?: PartnerType;
    website?: string;
    address?: CreateAddressDTO[];
    contact?: CreateContactDTO[];
    bank_accounts?: (ICreateBankAccount | IUpdateBankAccount)[];
}
