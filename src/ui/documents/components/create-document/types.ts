export type DocumentOperation = 'sale' | 'purchase';
export type DocumentGridTheme = 'material' | 'quartz' | 'alpine' | 'balham';

export interface DocumentCreateCopy {
	title: string;
	partyLabel: string;
	primaryAction: string;
	documentNumber: string;
	topTotal: string;
}

export interface DocumentLineItem {
	id: string;
	code: string;
	description: string;
	quantity: string;
	unitPrice: string;
	discount: string;
	taxType: string;
	subtotal: string;
}

export interface DocumentFooterTotals {
	taxBase: string;
	taxAmount: string;
	withholding: string;
	netPayable: string;
}

export interface DocumentGridThemeOption {
	value: DocumentGridTheme;
	label: string;
}
