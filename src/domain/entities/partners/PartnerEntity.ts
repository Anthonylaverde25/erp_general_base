import { CreatePartnerDTO, PartnerType, PartnerRole, PartnerTax } from './DTOs/PartnerDTOs';
import { AddressEntity } from '../addresses/Address';
import { ContactEntity } from '../contacts/Contact';
import { BankAccountEntity } from '../bank_accounts/BankAccount';
import { IAddress, IContact } from '@/types/company.types';
import { IBankAccount } from '@/types/bank_account.types';
import { CreateAddressDTO } from '../addresses/DTOs/CreateAddressDTO';
import { CreateContactDTO } from '../contacts/DTOs/CreateContactDTO';
import { ICreateBankAccount, IUpdateBankAccount } from '@/types/bank_account.types';
import { UpdatePartnerDTO } from './DTOs/PartnerDTOs';

export interface CreatePartnerWriteData {
	companyId: number;
	name: string;
	comercialName: string;
	vatNumber: string;
	cif: string;
	role: PartnerRole;
	paymentMethodId: number;
	type: PartnerType;
	creditAvailable: boolean;
	groupedBilling: boolean;
	currencyId?: number | null;
	website?: string;
	address?: CreateAddressDTO[];
	contact?: CreateContactDTO[];
	bankAccounts?: ICreateBankAccount[];
	saleTaxIds?: number[];
	purchaseTaxIds?: number[];
}

export interface UpdatePartnerWriteData {
	companyId?: number;
	name?: string;
	comercialName?: string;
	vatNumber?: string;
	cif?: string;
	role?: PartnerRole;
	paymentMethodId?: number;
	type?: PartnerType;
	creditAvailable?: boolean;
	groupedBilling?: boolean;
	currencyId?: number | null;
	website?: string;
	address?: CreateAddressDTO[];
	contact?: CreateContactDTO[];
	bankAccounts?: (ICreateBankAccount | IUpdateBankAccount)[];
	saleTaxIds?: number[];
	purchaseTaxIds?: number[];
}

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
	currency_id?: number | null;
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
	private _currency_id?: number | null;
	private _address: AddressEntity[];
	private _contact: ContactEntity[];
	private _bank_accounts: BankAccountEntity[];
	private _sale_taxes: PartnerTax[];
	private _purchase_taxes: PartnerTax[];
	private _createData?: CreatePartnerWriteData;
	private _updateData?: UpdatePartnerWriteData;

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
		currency_id: number | null | undefined,
		address: AddressEntity[],
		contact: ContactEntity[],
		bank_accounts: BankAccountEntity[],
		sale_taxes: PartnerTax[],
		purchase_taxes: PartnerTax[],
		createData?: CreatePartnerWriteData,
		updateData?: UpdatePartnerWriteData
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
		this._currency_id = currency_id;
		this._address = address;
		this._contact = contact;
		this._bank_accounts = bank_accounts;
		this._sale_taxes = sale_taxes;
		this._purchase_taxes = purchase_taxes;
		this._createData = createData;
		this._updateData = updateData;
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

	get currency_id(): number | null | undefined {
		return this._currency_id;
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
			data.currency_id ?? null,
			data.address ? data.address.map((addr: any) => AddressEntity.fromPrimitives(addr)) : [],
			data.contact ? data.contact.map((cnt: any) => ContactEntity.fromPrimitives(cnt)) : [],
			data.bank_accounts ? data.bank_accounts.map((acc: any) => BankAccountEntity.fromPrimitives(acc)) : [],
			data.sale_taxes || [],
			data.purchase_taxes || []
		);
	}

	static create(data: CreatePartnerDTO): PartnerEntity {
		const createData: CreatePartnerWriteData = {
			companyId: data.company_id,
			name: data.name,
			comercialName: data.comercial_name,
			vatNumber: data.vat_number,
			cif: data.cif,
			role: data.role,
			paymentMethodId: data.payment_method_id,
			type: data.type,
			creditAvailable: data.credit_available ?? false,
			groupedBilling: data.grouped_billing ?? false,
			currencyId: data.currency_id ?? null,
			website: data.website,
			address: data.address,
			contact: data.contact,
			bankAccounts: data.bank_accounts,
			saleTaxIds: data.sale_tax_ids,
			purchaseTaxIds: data.purchase_tax_ids
		};

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
			data.currency_id ?? null,
			data.address ? data.address.map((addr) => AddressEntity.create(addr)) : [],
			data.contact ? data.contact.map((cnt) => ContactEntity.create(cnt)) : [],
			data.bank_accounts ? data.bank_accounts.map((acc) => BankAccountEntity.create(acc)) : [],
			[], // sale_taxes not available on create DTO directly as objects usually
			[], // purchase_taxes not available on create DTO directly as objects usually
			createData
		);
	}

	static update(id: number, data: UpdatePartnerDTO): PartnerEntity {
		const updateData: UpdatePartnerWriteData = {
			companyId: data.company_id,
			name: data.name,
			comercialName: data.comercial_name,
			vatNumber: data.vat_number,
			cif: data.cif,
			role: data.role,
			paymentMethodId: data.payment_method_id,
			type: data.type,
			creditAvailable: data.credit_available,
			groupedBilling: data.grouped_billing,
			currencyId: data.currency_id,
			website: data.website,
			address: data.address,
			contact: data.contact,
			bankAccounts: data.bank_accounts,
			saleTaxIds: data.sale_tax_ids,
			purchaseTaxIds: data.purchase_tax_ids
		};

		return new PartnerEntity(
			id,
			data.company_id || 0,
			data.name || '',
			data.comercial_name || '',
			data.vat_number || '',
			data.cif || '',
			data.role || 'prospect',
			data.payment_method_id || 0,
			data.type || 'prospect',
			data.credit_available ?? false,
			data.grouped_billing ?? false,
			data.currency_id ?? null,
			data.address ? data.address.map((addr) => AddressEntity.create(addr)) : [],
			data.contact ? data.contact.map((cnt) => ContactEntity.create(cnt)) : [],
			data.bank_accounts
				? data.bank_accounts.map((acc) => BankAccountEntity.create(acc as ICreateBankAccount))
				: [],
			[], // sale_taxes update not usually passing full objects here
			[], // purchase_taxes update not usually passing full objects here
			undefined,
			updateData
		);
	}

	toCreateData(): CreatePartnerWriteData {
		if (this._createData) {
			return this._createData;
		}

		return {
			companyId: this._company_id,
			name: this._name,
			comercialName: this._comercial_name,
			vatNumber: this._vat_number,
			cif: this._cif,
			role: this._role,
			paymentMethodId: this._payment_method_id,
			type: this._type,
			creditAvailable: this._credit_available,
			groupedBilling: this._grouped_billing,
			currencyId: this._currency_id,
			address: this._address.map((addr) => addr.toPlainObject() as CreateAddressDTO),
			contact: this._contact.map((cnt) => cnt.toPlainObject() as CreateContactDTO),
			bankAccounts: this._bank_accounts.map((acc) => acc.toPlainObject() as ICreateBankAccount),
			saleTaxIds: this._sale_taxes.map((tax) => tax.id),
			purchaseTaxIds: this._purchase_taxes.map((tax) => tax.id)
		};
	}

	toUpdateData(): UpdatePartnerWriteData {
		if (this._updateData) {
			return this._updateData;
		}

		return {
			companyId: this._company_id,
			name: this._name,
			comercialName: this._comercial_name,
			vatNumber: this._vat_number,
			cif: this._cif,
			role: this._role,
			paymentMethodId: this._payment_method_id,
			type: this._type,
			creditAvailable: this._credit_available,
			groupedBilling: this._grouped_billing,
			currencyId: this._currency_id,
			address: this._address.map((addr) => addr.toPlainObject() as CreateAddressDTO),
			contact: this._contact.map((cnt) => cnt.toPlainObject() as CreateContactDTO),
			bankAccounts: this._bank_accounts.map((acc) => acc.toPlainObject() as ICreateBankAccount),
			saleTaxIds: this._sale_taxes.map((tax) => tax.id),
			purchaseTaxIds: this._purchase_taxes.map((tax) => tax.id)
		};
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
			currency_id: this._currency_id,
			address: this._address.map((addr) => addr.toPlainObject()),
			contact: this._contact.map((cnt) => cnt.toPlainObject()),
			bank_accounts: this._bank_accounts.map((acc) => acc.toPlainObject()),
			sale_taxes: this._sale_taxes,
			purchase_taxes: this._purchase_taxes
		};
	}
}
