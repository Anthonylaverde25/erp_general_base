import { CreateAddressDTO } from '@/domain/entities/addresses/DTOs/CreateAddressDTO';
import { CreateContactDTO } from '@/domain/entities/contacts/DTOs/CreateContactDTO';
import { IBankAccount, ICreateBankAccount, IUpdateBankAccount } from '@/types/bank_account.types';

export type EmployeeStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';

export interface EmployeeDTO {
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
	address: any[];
	contact: any[];
	bank_accounts: IBankAccount[];
	job_position?: any;
}

export interface CreateEmployeeDTO {
	company_id: number;
	department_id?: number | null;
	job_position_id?: number | null;
	first_name: string;
	last_name: string;
	document_type: string;
	document_number: string;
	birth_date?: string | null;
	gender?: string | null;
	hire_date: string;
	termination_date?: string | null;
	status?: EmployeeStatus;
	address?: CreateAddressDTO[];
	contact?: CreateContactDTO[];
	bank_accounts?: ICreateBankAccount[];
}

export interface UpdateEmployeeDTO {
	company_id?: number;
	department_id?: number | null;
	job_position_id?: number | null;
	first_name?: string;
	last_name?: string;
	document_type?: string;
	document_number?: string;
	birth_date?: string | null;
	gender?: string | null;
	hire_date?: string;
	termination_date?: string | null;
	status?: EmployeeStatus;
	address?: CreateAddressDTO[];
	contact?: CreateContactDTO[];
	bank_accounts?: (ICreateBankAccount | IUpdateBankAccount)[];
}
