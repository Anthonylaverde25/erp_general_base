import { PartnerFormType } from './partners.schema';

export const defaultCreatePartnerValues: PartnerFormType = {
    name: '',
    comercial_name: '',
    vat_number: '',
    cif: '',
    type: 'company',
    role: 'client',
    payment_method_id: '',
    website: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_postal_code: '',
    address_country: '',
    contact_email: '',
    contact_phone: '',
    bank_accounts: [],
    image: undefined
};

export const defaultUpdatePartnerValues = (data?: any): PartnerFormType => ({
    name: data?.name || '',
    comercial_name: data?.comercial_name || '',
    vat_number: data?.vat_number || '',
    cif: data?.cif || '',
    type: data?.type || 'company',
    role: data?.role || 'client',
    payment_method_id: String(data?.payment_method_id || ''),
    website: data?.website || '',
    address_street: data?.address_street || '',
    address_city: data?.address_city || '',
    address_state: data?.address_state || '',
    address_postal_code: data?.address_postal_code || '',
    address_country: data?.address_country || '',
    contact_email: data?.contact_email || '',
    contact_phone: data?.contact_phone || '',
    bank_accounts: data?.bank_accounts || [],
    image: data?.image || undefined
});
