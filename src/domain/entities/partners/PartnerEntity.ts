import { CreatePartnerDTO, PartnerType, PartnerRole } from "./DTOs/PartnerDTOs";
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
    address: IAddress[];
    contact: IContact[];
    bank_accounts: IBankAccount[];
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
    private _address: AddressEntity[];
    private _contact: ContactEntity[];
    private _bank_accounts: BankAccountEntity[];

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
        address: AddressEntity[],
        contact: ContactEntity[],
        bank_accounts: BankAccountEntity[]
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
        this._address = address;
        this._contact = contact;
        this._bank_accounts = bank_accounts;
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

    get address(): AddressEntity[] {
        return this._address;
    }

    get contact(): ContactEntity[] {
        return this._contact;
    }

    get bank_accounts(): BankAccountEntity[] {
        return this._bank_accounts;
    }

    static fromPrimitives(data: Partner): PartnerEntity {
        return new PartnerEntity(
            data.id,
            data.company_id,
            data.name,
            data.comercial_name,
            data.vat_number,
            data.cif,
            data.role || 'prospect',
            data.payment_method_id,
            data.type,
            data.address.map(addr => AddressEntity.fromPrimitives(addr)),
            data.contact.map(cnt => ContactEntity.fromPrimitives(cnt)),
            data.bank_accounts ? data.bank_accounts.map(acc => BankAccountEntity.fromPrimitives(acc)) : []
        );
    }

    static create(data: CreatePartnerDTO): PartnerEntity {
        return new PartnerEntity(
            0,
            0,
            data.name,
            data.comercial_name,
            data.vat_number,
            data.cif,
            data.role,
            data.payment_method_id,
            data.type,
            data.address ? data.address.map(addr => AddressEntity.create(addr)) : [],
            data.contact ? data.contact.map(cnt => ContactEntity.create(cnt)) : [],
            data.bank_accounts ? data.bank_accounts.map(acc => BankAccountEntity.create(acc)) : []
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
            data.address ? data.address.map(addr => AddressEntity.fromPrimitives(addr)) : [],
            data.contact ? data.contact.map(cnt => ContactEntity.fromPrimitives(cnt)) : [],
            data.bank_accounts ? data.bank_accounts.map(acc => BankAccountEntity.fromPrimitives(acc)) : []
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
            address: this._address.map(addr => addr.toPlainObject()),
            contact: this._contact.map(cnt => cnt.toPlainObject()),
            bank_accounts: this._bank_accounts.map(acc => acc.toPlainObject()),
        };
    }
}
