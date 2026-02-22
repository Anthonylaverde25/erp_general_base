import { CreateStoreFormType, UpdateStoreFormType } from './store.schema';

export const defaultCreateStoreValues: CreateStoreFormType = {
	name: '',
	code: '',
	is_active: true,
	address: {
		street: '',
		street_2: '',
		city: '',
		state: '',
		postal_code: '',
		country: '',
		default: false
	}
};

export const defaultUpdateStoreValues = (data?: any): UpdateStoreFormType => ({
	name: data?.name || '',
	code: data?.code || '',
	is_active: data?.is_active ?? true,
	address: data?.address
		? {
				street: data.address.street,
				street_2: data.address.street_2,
				city: data.address.city,
				state: data.address.state,
				postal_code: data.address.postal_code,
				country: data.address.country,
				default: data.address.default ?? false
			}
		: {
				street: '',
				street_2: '',
				city: '',
				state: '',
				postal_code: '',
				country: '',
				default: false
			}
});
