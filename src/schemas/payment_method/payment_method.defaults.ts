import { CreatePaymentMethodFormType, UpdatePaymentMethodFormType } from './payment_method.schema';

export const defaultCreatePaymentMethodValues: CreatePaymentMethodFormType = {
	name: '',
	type: 'cash',
	description: '',
	is_active: true
};

export const defaultUpdatePaymentMethodValues = (paymentMethod?: any): UpdatePaymentMethodFormType => ({
	id: paymentMethod?.id || 0,
	name: paymentMethod?.name || '',
	type: paymentMethod?.type || 'cash',
	description: paymentMethod?.description || '',
	is_active: paymentMethod?.is_active ?? true
});
