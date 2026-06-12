import { EmployeeFormType } from './employee.schema';

export const defaultCreateEmployeeValues: EmployeeFormType = {
	first_name: '',
	last_name: '',
	document_type: 'DNI',
	document_number: '',
	department_id: '',
	job_position_id: '',
	birth_date: '',
	gender: '',
	hire_date: new Date().toISOString().split('T')[0],
	termination_date: '',
	status: 'active',
	address_id: undefined,
	address_street: '',
	address_city: '',
	address_state: '',
	address_postal_code: '',
	address_country: '',
	address_county: '',
	contact_id: undefined,
	contact_email: '',
	contact_phone: '',
	bank_accounts: []
};

export const defaultUpdateEmployeeValues = (data?: any): EmployeeFormType => {
	const defaultAddress = data?.address && data.address.length > 0 ? data.address[0] : null;
	const defaultContact = data?.contact && data.contact.length > 0 ? data.contact[0] : null;

	return {
		first_name: data?.first_name || '',
		last_name: data?.last_name || '',
		document_type: data?.document_type || 'DNI',
		document_number: data?.document_number || '',
		department_id: data?.department_id ? String(data.department_id) : '',
		job_position_id: data?.job_position_id ? String(data.job_position_id) : '',
		birth_date: data?.birth_date || '',
		gender: data?.gender || '',
		hire_date: data?.hire_date || '',
		termination_date: data?.termination_date || '',
		status: data?.status || 'active',

		address_id: defaultAddress?.id || undefined,
		address_street: defaultAddress?.street || '',
		address_city: defaultAddress?.city || '',
		address_state: defaultAddress?.state || '',
		address_postal_code: defaultAddress?.postal_code || '',
		address_country: defaultAddress?.country || '',
		address_county: defaultAddress?.county || '',

		contact_id: defaultContact?.id || undefined,
		contact_email: defaultContact?.email || '',
		contact_phone: defaultContact?.phone || '',

		bank_accounts:
			data?.bank_accounts?.map((acc: any) => ({
				id: acc.id,
				name: acc.name,
				account_holder: acc.account_holder,
				account_number: acc.account_number,
				swift: acc.swift,
				is_default: acc.default ?? acc.is_default
			})) || []
	};
};
