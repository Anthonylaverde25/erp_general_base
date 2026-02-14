import { CreatePartnerDTO, PartnerType, PartnerRole, PartnerTax } from "./DTOs/PartnerDTOs";
import { AddressEntity } from "../addresses/Address";
import { ContactEntity } from "../contacts/Contact";
import { BankAccountEntity } from "../bank_accounts/BankAccount";
import { IAddress, IContact } from "@/types/company.types";
import { IBankAccount } from "@/types/bank_account.types";

export interface Partner {
    id: number;
    company_id: number;
    name: string;
    comercial_name: string;
    vat_number: string;
    cif: string;
    role: PartnerRole;
    payment_method_id: number;
    type: PartnerType;
    credit_available: boolean;
    grouped_billing: boolean;
    address: IAddress[];
    contact: IContact[];
    bank_accounts: IBankAccount[];
    sale_taxes: PartnerTax[];
    purchase_taxes: PartnerTax[];
}

export class PartnerEntity implements Partner {
    private _id: number;
    private _company_id: number;
    private _name: string;
    private _comercial_name: string;
    private _vat_number: string;
    private _cif: string;
    private _role: PartnerRole;
    private _payment_method_id: number;
    private _type: PartnerType;
    private _credit_available: boolean;
    private _grouped_billing: boolean;
    private _address: AddressEntity[];
    private _contact: ContactEntity[];
    private _bank_accounts: BankAccountEntity[];
    private _sale_taxes: PartnerTax[];
    private _purchase_taxes: PartnerTax[];

    constructor(
        id: number,
        company_id: number,
        name: string,
        comercial_name: string,
        vat_number: string,
        cif: string,
        role: PartnerRole,
        payment_method_id: number,
        type: PartnerType,
        credit_available: boolean,
        grouped_billing: boolean,
        address: AddressEntity[],
        contact: ContactEntity[],
        bank_accounts: BankAccountEntity[],
        sale_taxes: PartnerTax[],
        purchase_taxes: PartnerTax[]
    ) {
        this._id = id;
        this._company_id = company_id;
        this._name = name;
        this._comercial_name = comercial_name;
        this._vat_number = vat_number;
        this._cif = cif;
        this._role = role;
        this._payment_method_id = payment_method_id;
        this._type = type;
        this._credit_available = credit_available;
        this._grouped_billing = grouped_billing;
        this._address = address;
        this._contact = contact;
        this._bank_accounts = bank_accounts;
        this._sale_taxes = sale_taxes;
        this._purchase_taxes = purchase_taxes;
    }

    get id(): number {
        return this._id;
    }

    get company_id(): number {
        return this._company_id;
    }

    get name(): string {
        return this._name;
    }

    get comercial_name(): string {
        return this._comercial_name;
    }

    get vat_number(): string {
        return this._vat_number;
    }

    get cif(): string {
        return this._cif;
    }

    get role(): PartnerRole {
        return this._role;
    }

    get payment_method_id(): number {
        return this._payment_method_id;
    }

    get type(): PartnerType {
        return this._type;
    }

    get credit_available(): boolean {
        return this._credit_available;
    }

    get grouped_billing(): boolean {
        return this._grouped_billing;
    }

    get address(): AddressEntity[] {
        return this._address;
    }

    get contact(): ContactEntity[] {
        return this._contact;
    }

    get bank_accounts(): BankAccountEntity[] {
        return this._bank_accounts;
    }

    get sale_taxes(): PartnerTax[] {
        return this._sale_taxes;
    }

    get purchase_taxes(): PartnerTax[] {
        return this._purchase_taxes;
    }

    static fromPrimitives(data: any): PartnerEntity {
        let role: PartnerRole = 'prospect';

        if (data.roles && Array.isArray(data.roles)) {
            const roles = data.roles.map((r: any) => r.role);
            if (roles.includes('client') && roles.includes('supplier')) {
                role = 'client_supplier';
            } else if (roles.includes('client')) {
                role = 'client';
            } else if (roles.includes('supplier')) {
                role = 'supplier';
            } else if (roles.includes('prospect')) {
                role = 'prospect';
            }
        } else if (data.role) {
            role = data.role;
        }

        return new PartnerEntity(
            data.id,
            data.company_id,
            data.name,
            data.comercial_name,
            data.vat_number,
            data.cif,
            role,
            data.payment_method_id,
            data.type,
            data.credit_available ?? false,
            data.grouped_billing ?? false,
            data.address ? data.address.map((addr: any) => AddressEntity.fromPrimitives(addr)) : [],
            data.contact ? data.contact.map((cnt: any) => ContactEntity.fromPrimitives(cnt)) : [],
            data.bank_accounts ? data.bank_accounts.map((acc: any) => BankAccountEntity.fromPrimitives(acc)) : [],
            data.sale_taxes || [],
            data.purchase_taxes || []
        );
    }

    static create(data: CreatePartnerDTO): PartnerEntity {
        return new PartnerEntity(
            0,
            data.company_id,
            data.name,
            data.comercial_name,
            data.vat_number,
            data.cif,
            data.role,
            data.payment_method_id,
            data.type,
            data.credit_available ?? false,
            data.grouped_billing ?? false,
            data.address ? data.address.map(addr => AddressEntity.create(addr)) : [],
            data.contact ? data.contact.map(cnt => ContactEntity.create(cnt)) : [],
            data.bank_accounts ? data.bank_accounts.map(acc => BankAccountEntity.create(acc)) : [],
            [], // sale_taxes not available on create DTO directly as objects usually
            []  // purchase_taxes not available on create DTO directly as objects usually
        );
    }

    static update(id: number, data: Partial<Partner>): PartnerEntity {
        return new PartnerEntity(
            id,
            data.company_id || 0,
            data.name || "",
            data.comercial_name || "",
            data.vat_number || "",
            data.cif || "",
            data.role || 'prospect',
            data.payment_method_id || 0,
            data.type || 'prospect',
            data.credit_available ?? false,
            data.grouped_billing ?? false,
            data.address ? data.address.map(addr => AddressEntity.fromPrimitives(addr)) : [],
            data.contact ? data.contact.map(cnt => ContactEntity.fromPrimitives(cnt)) : [],
            data.bank_accounts ? data.bank_accounts.map(acc => BankAccountEntity.fromPrimitives(acc)) : [],
            [], // sale_taxes update not usually passing full objects here
            []  // purchase_taxes update not usually passing full objects here
        );
    }

    toPlainObject(): Partner {
        return {
            id: this._id,
            company_id: this._company_id,
            name: this._name,
            comercial_name: this._comercial_name,
            vat_number: this._vat_number,
            cif: this._cif,
            role: this._role,
            payment_method_id: this._payment_method_id,
            type: this._type,
            credit_available: this._credit_available,
            grouped_billing: this._grouped_billing,
            address: this._address.map(addr => addr.toPlainObject()),
            contact: this._contact.map(cnt => cnt.toPlainObject()),
            bank_accounts: this._bank_accounts.map(acc => acc.toPlainObject()),
            sale_taxes: this._sale_taxes,
            purchase_taxes: this._purchase_taxes,
        };
    }
}
