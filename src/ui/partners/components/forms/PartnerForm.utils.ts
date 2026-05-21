import { PartnerFormType } from '@/schemas/partners/partners.schema';
import {
	CreatePartnerDTO,
	UpdatePartnerDTO,
	PartnerType,
	PartnerRole
} from '@/domain/entities/partners/DTOs/PartnerDTOs';
import { CreateAddressDTO } from '@/domain/entities/addresses/DTOs/CreateAddressDTO';
import { CreateContactDTO } from '@/domain/entities/contacts/DTOs/CreateContactDTO';

export const mapPartnerFormToDTO = (
	values: PartnerFormType,
	companyId: number
): CreatePartnerDTO | UpdatePartnerDTO => {
	console.log('values desde el dto', values);
	const address: CreateAddressDTO[] = [];

	if (values.address_street || values.address_city) {
		address.push({
			id: values.address_id,
			street: values.address_street || '',
			city: values.address_city || '',
			state: values.address_state || '',
			postal_code: values.address_postal_code || '',
			country: values.address_country || '',
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
		name: values.name,
		comercial_name: values.comercial_name || '',
		vat_number: values.vat_number || '',
		cif: values.cif || '',
		type: values.type as PartnerType,
		role: values.role as PartnerRole,
		payment_method_id: Number(values.payment_method_id),
		credit_available: values.credit_available ?? false,
		grouped_billing: values.grouped_billing ?? false,
		currency_id: values.currency_id ? Number(values.currency_id) : undefined,
		website: values.website || '',
		address: address.length > 0 ? address : undefined,
		contact: contact.length > 0 ? contact : undefined,
		bank_accounts: values.bank_accounts?.map((acc: any) => ({
			id: acc.id,
			name: acc.name || '',
			account_holder: acc.account_holder || '',
			account_number: acc.account_number || '',
			swift: acc.swift || '',
			is_default: acc.is_default
		})),
		sale_tax_ids: values.sale_tax_ids && values.sale_tax_ids.length > 0 ? values.sale_tax_ids : undefined,
		purchase_tax_ids:
			values.purchase_tax_ids && values.purchase_tax_ids.length > 0 ? values.purchase_tax_ids : undefined
	};
};
