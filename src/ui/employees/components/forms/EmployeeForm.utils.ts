import { EmployeeFormType } from '@/schemas/employee/employee.schema';
import { CreateEmployeeDTO, UpdateEmployeeDTO } from '@/domain/entities/employees/DTOs/EmployeeDTOs';
import { CreateAddressDTO } from '@/domain/entities/addresses/DTOs/CreateAddressDTO';
import { CreateContactDTO } from '@/domain/entities/contacts/DTOs/CreateContactDTO';

export const mapEmployeeFormToDTO = (
	values: EmployeeFormType,
	companyId: number
): CreateEmployeeDTO | UpdateEmployeeDTO => {
	const address: CreateAddressDTO[] = [];

	if (values.address_street || values.address_city) {
		address.push({
			id: values.address_id,
			street: values.address_street || '',
			city: values.address_city || '',
			state: values.address_state || '',
			postal_code: values.address_postal_code || '',
			country: values.address_country || '',
			county: values.address_county || '',
			default: true
		});
	}

	const contact: CreateContactDTO[] = [];

	if (values.contact_email || values.contact_phone) {
		contact.push({
			id: values.contact_id,
			email: values.contact_email || '',
			phone: values.contact_phone || '',
			default: true
		});
	}

	return {
		company_id: companyId,
		department_id: values.department_id ? Number(values.department_id) : null,
		job_position_id: values.job_position_id ? Number(values.job_position_id) : null,
		first_name: values.first_name,
		last_name: values.last_name,
		document_type: values.document_type,
		document_number: values.document_number,
		birth_date: values.birth_date || null,
		gender: values.gender || null,
		hire_date: values.hire_date,
		termination_date: values.termination_date || null,
		status: values.status,
		address: address.length > 0 ? address : undefined,
		contact: contact.length > 0 ? contact : undefined,
		bank_accounts: values.bank_accounts?.map((acc: any) => ({
			id: acc.id,
			name: acc.name || '',
			account_holder: acc.account_holder || '',
			account_number: acc.account_number || '',
			swift: acc.swift || '',
			is_default: acc.is_default
		}))
	};
};
