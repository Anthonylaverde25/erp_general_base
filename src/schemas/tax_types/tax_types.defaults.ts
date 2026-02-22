import { CreateTaxTypeFormType, UpdateTaxTypeFormType } from './tax_types.schema';

export const defaultCreateTaxTypeValues: CreateTaxTypeFormType = {
	code: '',
	name: '',
	description: '',
	operation: 'add' as 'add' | 'subtract',
	is_active: true
};

export const defaultUpdateTaxTypeValues = (data?: any): UpdateTaxTypeFormType => ({
	code: data?.code || '',
	name: data?.name || '',
	description: data?.description || '',
	operation: (data?.operation as 'add' | 'subtract') || 'add',
	is_active: data?.is_active ?? true
});
