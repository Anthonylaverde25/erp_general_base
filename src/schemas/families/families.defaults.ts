import { FamilyFormType } from './families.schema';

export const defaultCreateFamilyValues: FamilyFormType = {
	name: '',
	tax_rate_ids: [],
	percentage: 0
};

export const defaultUpdateFamilyValues = (data?: any): FamilyFormType => ({
	name: data?.name || '',
	tax_rate_ids: data?.tax_rate_ids || [],
	percentage: data?.percentage || 0
});
