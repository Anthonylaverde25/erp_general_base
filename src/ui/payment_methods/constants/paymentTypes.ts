export const PAYMENT_TYPES = [
	{ value: 'cash', label: 'Efectivo' },
	{ value: 'bank_transfer', label: 'Transferencia Bancaria' },
	{ value: 'credit_card', label: 'Tarjeta de Crédito' },
	{ value: 'debit_card', label: 'Tarjeta de Débito' },
	{ value: 'check', label: 'Cheque' },
	{ value: 'other', label: 'Otro' }
] as const;

export type PaymentType = (typeof PAYMENT_TYPES)[number]['value'];
