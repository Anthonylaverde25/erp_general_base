import { CreateEmployeeDTO, EmployeeStatus, UpdateEmployeeDTO } from './DTOs/EmployeeDTOs';
import { AddressEntity } from '../addresses/Address';
import { ContactEntity } from '../contacts/Contact';
import { BankAccountEntity } from '../bank_accounts/BankAccount';
import { IAddress, IContact } from '@/types/company.types';
import { IBankAccount, ICreateBankAccount, IUpdateBankAccount } from '@/types/bank_account.types';
import { CreateAddressDTO } from '../addresses/DTOs/CreateAddressDTO';
import { CreateContactDTO } from '../contacts/DTOs/CreateContactDTO';

export interface CreateEmployeeWriteData {
	companyId: number;
	departmentId?: number | null;
	jobPositionId?: number | null;
	firstName: string;
	lastName: string;
	documentType: string;
	documentNumber: string;
	birthDate?: string | null;
	gender?: string | null;
	hireDate: string;
	terminationDate?: string | null;
	status: EmployeeStatus;
	address?: CreateAddressDTO[];
	contact?: CreateContactDTO[];
	bankAccounts?: ICreateBankAccount[];
}

export interface UpdateEmployeeWriteData {
	companyId?: number;
	departmentId?: number | null;
	jobPositionId?: number | null;
	firstName?: string;
	lastName?: string;
	documentType?: string;
	documentNumber?: string;
	birthDate?: string | null;
	gender?: string | null;
	hireDate?: string;
	terminationDate?: string | null;
	status?: EmployeeStatus;
	address?: CreateAddressDTO[];
	contact?: CreateContactDTO[];
	bankAccounts?: (ICreateBankAccount | IUpdateBankAccount)[];
}

export interface Employee {
	id: number;
	company_id: number;
	department_id?: number | null;
	job_position_id?: number | null;
	first_name: string;
	last_name: string;
	full_name: string;
	document_type: string;
	document_number: string;
	birth_date?: string | null;
	gender?: string | null;
	hire_date: string;
	termination_date?: string | null;
	status: EmployeeStatus;
	address: IAddress[];
	contact: IContact[];
	bank_accounts: IBankAccount[];
	job_position?: any;
}

export class EmployeeEntity implements Employee {
	private _id: number;
	private _company_id: number;
	private _department_id?: number | null;
	private _job_position_id?: number | null;
	private _first_name: string;
	private _last_name: string;
	private _document_type: string;
	private _document_number: string;
	private _birth_date?: string | null;
	private _gender?: string | null;
	private _hire_date: string;
	private _termination_date?: string | null;
	private _status: EmployeeStatus;
	private _address: AddressEntity[];
	private _contact: ContactEntity[];
	private _bank_accounts: BankAccountEntity[];
	private _job_position?: any;
	private _createData?: CreateEmployeeWriteData;
	private _updateData?: UpdateEmployeeWriteData;

	constructor(
		id: number,
		company_id: number,
		department_id: number | null | undefined,
		job_position_id: number | null | undefined,
		first_name: string,
		last_name: string,
		document_type: string,
		document_number: string,
		birth_date: string | null | undefined,
		gender: string | null | undefined,
		hire_date: string,
		termination_date: string | null | undefined,
		status: EmployeeStatus,
		address: AddressEntity[],
		contact: ContactEntity[],
		bank_accounts: BankAccountEntity[],
		job_position?: any,
		createData?: CreateEmployeeWriteData,
		updateData?: UpdateEmployeeWriteData
	) {
		this._id = id;
		this._company_id = company_id;
		this._department_id = department_id;
		this._job_position_id = job_position_id;
		this._first_name = first_name;
		this._last_name = last_name;
		this._document_type = document_type;
		this._document_number = document_number;
		this._birth_date = birth_date;
		this._gender = gender;
		this._hire_date = hire_date;
		this._termination_date = termination_date;
		this._status = status;
		this._address = address;
		this._contact = contact;
		this._bank_accounts = bank_accounts;
		this._job_position = job_position;
		this._createData = createData;
		this._updateData = updateData;
	}

	get id(): number {
		return this._id;
	}

	get company_id(): number {
		return this._company_id;
	}

	get department_id(): number | null | undefined {
		return this._department_id;
	}

	get job_position_id(): number | null | undefined {
		return this._job_position_id;
	}

	get job_position(): any {
		return this._job_position;
	}

	get first_name(): string {
		return this._first_name;
	}

	get last_name(): string {
		return this._last_name;
	}

	get full_name(): string {
		return `${this._first_name} ${this._last_name}`.trim();
	}

	get document_type(): string {
		return this._document_type;
	}

	get document_number(): string {
		return this._document_number;
	}

	get birth_date(): string | null | undefined {
		return this._birth_date;
	}

	get gender(): string | null | undefined {
		return this._gender;
	}

	get hire_date(): string {
		return this._hire_date;
	}

	get termination_date(): string | null | undefined {
		return this._termination_date;
	}

	get status(): EmployeeStatus {
		return this._status;
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

	static fromPrimitives(data: any): EmployeeEntity {
		return new EmployeeEntity(
			data.id,
			data.company_id,
			data.department_id ?? null,
			data.job_position_id ?? null,
			data.first_name,
			data.last_name,
			data.document_type,
			data.document_number,
			data.birth_date ?? null,
			data.gender ?? null,
			data.hire_date,
			data.termination_date ?? null,
			data.status ?? 'active',
			data.address ? data.address.map((addr: any) => AddressEntity.fromPrimitives(addr)) : [],
			data.contact ? data.contact.map((cnt: any) => ContactEntity.fromPrimitives(cnt)) : [],
			data.bank_accounts ? data.bank_accounts.map((acc: any) => BankAccountEntity.fromPrimitives(acc)) : [],
			data.job_position ?? null
		);
	}

	static create(data: CreateEmployeeDTO): EmployeeEntity {
		const createData: CreateEmployeeWriteData = {
			companyId: data.company_id,
			departmentId: data.department_id,
			jobPositionId: data.job_position_id,
			firstName: data.first_name,
			lastName: data.last_name,
			documentType: data.document_type,
			documentNumber: data.document_number,
			birthDate: data.birth_date,
			gender: data.gender,
			hireDate: data.hire_date,
			terminationDate: data.termination_date,
			status: data.status ?? 'active',
			address: data.address,
			contact: data.contact,
			bankAccounts: data.bank_accounts
		};

		return new EmployeeEntity(
			0,
			data.company_id,
			data.department_id,
			data.job_position_id,
			data.first_name,
			data.last_name,
			data.document_type,
			data.document_number,
			data.birth_date,
			data.gender,
			data.hire_date,
			data.termination_date,
			data.status ?? 'active',
			data.address ? data.address.map((addr) => AddressEntity.create(addr)) : [],
			data.contact ? data.contact.map((cnt) => ContactEntity.create(cnt)) : [],
			data.bank_accounts ? data.bank_accounts.map((acc) => BankAccountEntity.create(acc)) : [],
			null,
			createData
		);
	}

	static update(id: number, data: UpdateEmployeeDTO): EmployeeEntity {
		const updateData: UpdateEmployeeWriteData = {
			companyId: data.company_id,
			departmentId: data.department_id,
			jobPositionId: data.job_position_id,
			firstName: data.first_name,
			lastName: data.last_name,
			documentType: data.document_type,
			documentNumber: data.document_number,
			birthDate: data.birth_date,
			gender: data.gender,
			hireDate: data.hire_date,
			terminationDate: data.termination_date,
			status: data.status,
			address: data.address,
			contact: data.contact,
			bankAccounts: data.bank_accounts
		};

		return new EmployeeEntity(
			id,
			data.company_id || 0,
			data.department_id || null,
			data.job_position_id || null,
			data.first_name || '',
			data.last_name || '',
			data.document_type || '',
			data.document_number || '',
			data.birth_date,
			data.gender,
			data.hire_date || '',
			data.termination_date,
			data.status ?? 'active',
			data.address ? data.address.map((addr) => AddressEntity.create(addr)) : [],
			data.contact ? data.contact.map((cnt) => ContactEntity.create(cnt)) : [],
			data.bank_accounts
				? data.bank_accounts.map((acc) => BankAccountEntity.create(acc as ICreateBankAccount))
				: [],
			null,
			undefined,
			updateData
		);
	}

	toCreateData(): CreateEmployeeWriteData {
		if (this._createData) {
			return this._createData;
		}

		return {
			companyId: this._company_id,
			departmentId: this._department_id,
			jobPositionId: this._job_position_id,
			firstName: this._first_name,
			lastName: this._last_name,
			documentType: this._document_type,
			documentNumber: this._document_number,
			birthDate: this._birth_date,
			gender: this._gender,
			hireDate: this._hire_date,
			terminationDate: this._termination_date,
			status: this._status,
			address: this._address.map((addr) => addr.toPlainObject() as CreateAddressDTO),
			contact: this._contact.map((cnt) => cnt.toPlainObject() as CreateContactDTO),
			bankAccounts: this._bank_accounts.map((acc) => acc.toPlainObject() as ICreateBankAccount)
		};
	}

	toUpdateData(): UpdateEmployeeWriteData {
		if (this._updateData) {
			return this._updateData;
		}

		return {
			companyId: this._company_id,
			departmentId: this._department_id,
			jobPositionId: this._job_position_id,
			firstName: this._first_name,
			lastName: this._last_name,
			documentType: this._document_type,
			documentNumber: this._document_number,
			birthDate: this._birth_date,
			gender: this._gender,
			hireDate: this._hire_date,
			terminationDate: this._termination_date,
			status: this._status,
			address: this._address.map((addr) => addr.toPlainObject() as CreateAddressDTO),
			contact: this._contact.map((cnt) => cnt.toPlainObject() as CreateContactDTO),
			bankAccounts: this._bank_accounts.map((acc) => acc.toPlainObject() as ICreateBankAccount)
		};
	}

	toPlainObject(): Employee {
		return {
			id: this._id,
			company_id: this._company_id,
			department_id: this._department_id,
			job_position_id: this._job_position_id,
			first_name: this._first_name,
			last_name: this._last_name,
			full_name: this.full_name,
			document_type: this._document_type,
			document_number: this._document_number,
			birth_date: this._birth_date,
			gender: this._gender,
			hire_date: this._hire_date,
			termination_date: this._termination_date,
			status: this._status,
			address: this._address.map((addr) => addr.toPlainObject()),
			contact: this._contact.map((cnt) => cnt.toPlainObject()),
			bank_accounts: this._bank_accounts.map((acc) => acc.toPlainObject()),
			job_position: this._job_position
		};
	}
}
