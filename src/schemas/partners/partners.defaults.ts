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
    image: undefined,
    sale_tax_ids: [],
    purchase_tax_ids: [],
};

export const defaultUpdatePartnerValues = (data?: any): PartnerFormType => {
    const defaultAddress = data?.address && data.address.length > 0 ? data.address[0] : null;
    const defaultContact = data?.contact && data.contact.length > 0 ? data.contact[0] : null;

    return {
        name: data?.name || '',
        comercial_name: data?.comercial_name || '',
        vat_number: data?.vat_number || '',
        cif: data?.cif || '',
        type: data?.type || 'company',
        role: data?.role || 'client',
        payment_method_id: String(data?.payment_method_id || ''),
        website: data?.website || '',

        address_street: defaultAddress?.street || '',
        address_city: defaultAddress?.city || '',
        address_state: defaultAddress?.state || '',
        address_postal_code: defaultAddress?.postal_code || '',
        address_country: defaultAddress?.country || '',

        contact_email: defaultContact?.email || '',
        contact_phone: defaultContact?.phone || '',

        bank_accounts: data?.bank_accounts?.map((acc: any) => ({
            id: acc.id,
            name: acc.name,
            account_holder: acc.account_holder,
            account_number: acc.account_number,
            swift: acc.swift,
            is_default: acc.is_default
        })) || [],
        image: data?.image || undefined,
        sale_tax_ids: data?.sale_taxes?.map((t: any) => t.id) || [],
        purchase_tax_ids: data?.purchase_taxes?.map((t: any) => t.id) || [],
    };
};
