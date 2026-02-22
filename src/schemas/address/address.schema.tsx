import { z } from 'zod';
import { IAddress } from '@/types/company.types';

export const addressSchema = z.object({
	street: z.string().min(1, 'La calle es requerida'),
	city: z.string().min(1, 'La ciudad es requerida'),
	state: z.string().min(1, 'La provincia es requerida'),
	postal_code: z.string().min(1, 'El código postal es requerido'),
	country: z.string().min(1, 'El país es requerido'),
	default: z.boolean().default(false)
});

export type AddressFormData = z.infer<typeof addressSchema>;

export const defaultUpdateAddressValues = (address?: IAddress | null): AddressFormData => ({
	street: address?.street || '',
	city: address?.city || '',
	state: address?.state || '',
	postal_code: address?.postal_code || '',
	country: address?.country || '',
	default: address?.default || false
});
